import { Browser } from "@capacitor/browser"
import { App } from "@capacitor/app"

const FILE_PATH = "/finanzas-db.json"

const isNative = !!(window.Capacitor?.isNativePlatform?.())
const REDIRECT_URI = isNative
  ? "com.martin.finanzasapp://oauth"
  : `${window.location.origin}/oauth`

let accessToken = null
let appUrlListenerHandle = null

// ── PKCE HELPERS ──────────────────────────────────────────────────────────────

function _generarCodeVerifier() {
  const array = new Uint8Array(64)
  crypto.getRandomValues(array)
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}

async function _generarCodeChallenge(verifier) {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const digest = await crypto.subtle.digest("SHA-256", data)
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}

// ── AUTH ──────────────────────────────────────────────────────────────────────

export async function iniciarAuthDropbox(appKey) {
  const codeVerifier = _generarCodeVerifier()
  const codeChallenge = await _generarCodeChallenge(codeVerifier)

  // Guardar verifier para usarlo en el callback
  sessionStorage.setItem("dropbox-pkce-verifier", codeVerifier)
  sessionStorage.setItem("dropbox-pkce-appkey", appKey)

  const authUrl =
    `https://www.dropbox.com/oauth2/authorize` +
    `?client_id=${appKey}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&code_challenge=${codeChallenge}` +
    `&code_challenge_method=S256` +
    `&token_access_type=offline` +
    `&scope=files.content.read%20files.content.write%20files.metadata.read`

  if (!isNative) {
    window.location.href = authUrl
    return new Promise(() => {}) // nunca resuelve, la página se redirige
  }

  // En móvil: flujo con Browser y appUrlOpen
  return new Promise(async (resolve, reject) => {
    if (appUrlListenerHandle) {
      appUrlListenerHandle.remove()
      appUrlListenerHandle = null
    }

    appUrlListenerHandle = await App.addListener("appUrlOpen", async (event) => {
      appUrlListenerHandle.remove()
      appUrlListenerHandle = null

      try { await Browser.close() } catch (_) {}

      const url = event.url
      const params = Object.fromEntries(
        new URLSearchParams(url.split("?")[1] || url.split("#")[1] || "")
      )
      const code = params.code

      if (!code) {
        reject(new Error("No se recibió authorization code en el callback"))
        return
      }

      try {
        const token = await _intercambiarCodigoPorToken(appKey, code, codeVerifier)
        resolve(token)
      } catch (e) {
        reject(e)
      }
    })

    await Browser.open({ url: authUrl })
  })
}

async function _intercambiarCodigoPorToken(appKey, code, codeVerifier) {
  const res = await fetch("https://api.dropboxapi.com/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      grant_type: "authorization_code",
      client_id: appKey,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Error al intercambiar código: ${err}`)
  }

  const json = await res.json()
  localStorage.setItem("dropbox-appkey", appKey)
  _guardarTokenes(json.access_token, json.refresh_token, json.expires_in)
  return json.access_token
}

async function _renovarAccessToken() {
  const refreshToken = localStorage.getItem("dropbox-refresh-token")
  const appKey = sessionStorage.getItem("dropbox-pkce-appkey") ||
                 localStorage.getItem("dropbox-appkey")

  if (!refreshToken || !appKey) throw new Error("No hay refresh_token disponible")

  const res = await fetch("https://api.dropboxapi.com/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: appKey,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Error al renovar token: ${err}`)
  }

  const json = await res.json()
  _guardarTokenes(json.access_token, refreshToken, json.expires_in)
  return json.access_token
}

// Asegura que accessToken esté vigente antes de cada llamada a la API
async function _obtenerTokenValido() {
  const expira = parseInt(localStorage.getItem("dropbox-token-expira") || "0")
  const margen = 5 * 60 * 1000 // renovar 5 min antes de que caduque

  if (accessToken && Date.now() < expira - margen) {
    return accessToken
  }

  // Intentar renovar con refresh_token
  return await _renovarAccessToken()
}

function _guardarTokenes(token, refreshToken, expiresIn) {
  accessToken = token
  const expira = Date.now() + (expiresIn ?? 14400) * 1000
  localStorage.setItem("dropbox-token", token)
  localStorage.setItem("dropbox-token-expira", expira.toString())
  if (refreshToken) {
    localStorage.setItem("dropbox-refresh-token", refreshToken)
  }
}

export function tokenGuardadoDropbox() {
  const refreshToken = localStorage.getItem("dropbox-refresh-token")
  if (refreshToken) {
    // Cargar el access_token en memoria si aún es válido
    const t = localStorage.getItem("dropbox-token")
    const expira = parseInt(localStorage.getItem("dropbox-token-expira") || "0")
    if (t && Date.now() < expira) {
      accessToken = t
    }
    return true // con refresh_token siempre podemos renovar
  }
  return false
}

export function cerrarSesionDropbox() {
  accessToken = null
  localStorage.removeItem("dropbox-token")
  localStorage.removeItem("dropbox-token-expira")
  localStorage.removeItem("dropbox-refresh-token")
  localStorage.removeItem("dropbox-appkey")
}

// Llamar desde la página /oauth para intercambiar el code que dejó Dropbox
export async function procesarCallbackDropboxWeb() {
  const params = Object.fromEntries(
    new URLSearchParams(window.location.search.slice(1))
  )
  const code = params.code
  if (!code) return false

  const codeVerifier = sessionStorage.getItem("dropbox-pkce-verifier")
  const appKey = sessionStorage.getItem("dropbox-pkce-appkey")
  if (!codeVerifier || !appKey) return false

  // Persistir appKey para renovaciones futuras
  localStorage.setItem("dropbox-appkey", appKey)

  await _intercambiarCodigoPorToken(appKey, code, codeVerifier)
  sessionStorage.removeItem("dropbox-pkce-verifier")
  sessionStorage.removeItem("dropbox-pkce-appkey")
  return true
}

// ── DROPBOX API ───────────────────────────────────────────────────────────────

async function descargarDBDropbox() {
  const token = await _obtenerTokenValido()

  const res = await fetch("https://content.dropboxapi.com/2/files/download", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Dropbox-API-Arg": JSON.stringify({ path: FILE_PATH }),
    },
  })

  if (res.status === 409) return null
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Dropbox download error ${res.status}: ${err}`)
  }
  return await res.json()
}

async function subirDBDropbox(datos) {
  const token = await _obtenerTokenValido()

  const res = await fetch("https://content.dropboxapi.com/2/files/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/octet-stream",
      "Dropbox-API-Arg": JSON.stringify({
        path: FILE_PATH,
        mode: "overwrite",
        autorename: false,
        mute: true,
      }),
    },
    body: JSON.stringify(datos),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Dropbox upload error ${res.status}: ${err}`)
  }
}

// ── SYNC COMPLETO ─────────────────────────────────────────────────────────────

export async function sincronizarDropbox(datosLocales, actualizarDatos, mergeDatos) {
  if (!localStorage.getItem("dropbox-refresh-token") && !accessToken) {
    throw new Error("No autenticado en Dropbox")
  }
  const remoto = await descargarDBDropbox()
  const fusionado = remoto ? mergeDatos(datosLocales, remoto) : datosLocales
  await subirDBDropbox(fusionado)
  actualizarDatos(fusionado)
  return fusionado
}