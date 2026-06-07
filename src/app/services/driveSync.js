// driveSync.js — Web pura (sin Capacitor)
// Auth: OAuth2 redirect + renovación silenciosa por iframe (prompt=none)

const FILE_NAME = "finanzas-db.json"

const CLIENT_ID = "588167639813-71hurbr33dvaaanmf0n47uq45olvpc16.apps.googleusercontent.com"
const SCOPES    = "https://www.googleapis.com/auth/drive.file"
const REDIRECT_URI = window.location.origin + window.location.pathname

let accessToken = null

// ── AUTH ──────────────────────────────────────────────────────────────────────

function _guardarToken(token, expiresInMs = 55 * 60 * 1000) {
  accessToken = token
  const expira = Date.now() + expiresInMs
  localStorage.setItem("drive-token", token)
  localStorage.setItem("drive-token-expira", expira.toString())
}

/**
 * Intenta renovar el token silenciosamente usando un iframe oculto con prompt=none.
 * Google responderá con el token en el hash si la sesión sigue activa.
 * Si no hay sesión activa, rechaza la promesa para que la UI pida reconectar.
 */
function _renovarTokenSilencioso() {
  return new Promise((resolve, reject) => {
    const state = crypto.randomUUID()
    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth")
    url.searchParams.set("client_id",     CLIENT_ID)
    url.searchParams.set("redirect_uri",  REDIRECT_URI)
    url.searchParams.set("response_type", "token")
    url.searchParams.set("scope",         SCOPES)
    url.searchParams.set("prompt",        "none")
    url.searchParams.set("state",         state)

    const iframe = document.createElement("iframe")
    iframe.style.display = "none"
    document.body.appendChild(iframe)

    const timer = setTimeout(() => {
      document.body.removeChild(iframe)
      reject(new Error("Renovación silenciosa: timeout"))
    }, 10000)

    iframe.onload = () => {
      try {
        const hash = new URLSearchParams(
          iframe.contentWindow.location.hash.substring(1)
        )
        const token = hash.get("access_token")
        const expiresIn = parseInt(hash.get("expires_in") || "3300") * 1000
        if (token) {
          _guardarToken(token, expiresIn)
          clearTimeout(timer)
          document.body.removeChild(iframe)
          resolve(token)
        } else {
          throw new Error("Sin token en respuesta iframe")
        }
      } catch (e) {
        clearTimeout(timer)
        document.body.removeChild(iframe)
        localStorage.removeItem("drive-token")
        localStorage.removeItem("drive-token-expira")
        accessToken = null
        reject(new Error("Sesión de Google expirada, vuelve a conectar Drive"))
      }
    }

    iframe.src = url.toString()
  })
}

async function _obtenerTokenValido() {
  const expira = parseInt(localStorage.getItem("drive-token-expira") || "0")
  const margen = 3 * 60 * 1000

  if (accessToken && Date.now() < expira - margen) {
    return accessToken
  }

  return await _renovarTokenSilencioso()
}

/**
 * Inicia el flujo OAuth redirect.
 * Guarda un flag en sessionStorage para que al volver
 * Ajustes.jsx llame a manejarCallbackDrive() y haga sync.
 */
export function iniciarAuth() {
  const state = crypto.randomUUID()
  sessionStorage.setItem("drive-oauth-state", state)
  sessionStorage.setItem("drive-oauth-pending", "1")

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth")
  url.searchParams.set("client_id",     CLIENT_ID)
  url.searchParams.set("redirect_uri",  REDIRECT_URI)
  url.searchParams.set("response_type", "token")
  url.searchParams.set("scope",         SCOPES)
  url.searchParams.set("prompt",        "consent")
  url.searchParams.set("state",         state)

  window.location.href = url.toString()
}

/**
 * Llámalo al montar Ajustes si hay hash en la URL (vuelta del redirect).
 * Devuelve true si procesó un token, false si no había nada que procesar.
 */
export function manejarCallbackDrive() {
  const hash = new URLSearchParams(window.location.hash.substring(1))
  const token = hash.get("access_token")
  const state = hash.get("state")
  const savedState = sessionStorage.getItem("drive-oauth-state")

  if (!token) return false
  if (state !== savedState) return false // CSRF check

  const expiresIn = parseInt(hash.get("expires_in") || "3300") * 1000
  _guardarToken(token, expiresIn)
  sessionStorage.removeItem("drive-oauth-state")
  sessionStorage.removeItem("drive-oauth-pending")

  // Limpiar el hash de la URL sin recargar
  history.replaceState(null, "", window.location.pathname + window.location.search)

  return true
}

export function tokenGuardado() {
  const t = localStorage.getItem("drive-token")
  if (t) {
    accessToken = t
    return true
  }
  return false
}

/**
 * Renueva el token silenciosamente al arrancar.
 * Devuelve true si la sesión sigue activa, false si hay que re-login manual.
 */
export async function renovarSesionDrive() {
  if (!localStorage.getItem("drive-token")) return false
  try {
    await _renovarTokenSilencioso()
    return true
  } catch (_) {
    return false
  }
}

export function cerrarSesion() {
  accessToken = null
  localStorage.removeItem("drive-token")
  localStorage.removeItem("drive-token-expira")
  sessionStorage.removeItem("drive-oauth-state")
  sessionStorage.removeItem("drive-oauth-pending")
}

// ── DRIVE API ─────────────────────────────────────────────────────────────────

async function buscarArchivo() {
  const token = await _obtenerTokenValido()
  const query = encodeURIComponent(`name='${FILE_NAME}' and trashed=false`)
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)&spaces=drive`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (!res.ok) {
    const err = await res.json()
    throw new Error(`Drive buscarArchivo error ${res.status}: ${JSON.stringify(err)}`)
  }
  const data = await res.json()
  return data.files?.[0]?.id ?? null
}

async function subirDB(datos, fileId) {
  const token = await _obtenerTokenValido()
  const body = JSON.stringify(datos)

  if (fileId) {
    const res = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body,
      }
    )
    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Drive subirDB (update) error ${res.status}: ${err}`)
    }
  } else {
    const metadata = new Blob(
      [JSON.stringify({ name: FILE_NAME, mimeType: "application/json" })],
      { type: "application/json" }
    )
    const content = new Blob([body], { type: "application/json" })
    const form = new FormData()
    form.append("metadata", metadata)
    form.append("file", content)
    const res = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      }
    )
    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Drive subirDB (create) error ${res.status}: ${err}`)
    }
  }
}

// ── MERGE ─────────────────────────────────────────────────────────────────────

function _esTombstone(item) {
  return (
    item.eliminado === true &&
    Object.keys(item).length === 3 &&
    "id" in item &&
    "actualizadoEn" in item
  )
}

export function mergeDatos(local, remoto) {
  const resultado = { ...local }

  const colecciones = [
    "salarios", "variaciones", "egresos", "ajustes",
    "planes", "ubicacion", "inversiones", "cuentasInversion",
    "extra1", "extra2", "extra3",
  ]

  for (const col of colecciones) {
    const localArr  = local[col]  || []
    const remotoArr = remoto[col] || []

    const mapa = {}
    for (const item of localArr) {
      mapa[item.id] = item
    }

    for (const itemRemoto of remotoArr) {
      const itemLocal = mapa[itemRemoto.id]

      if (!itemLocal) {
        if (!_esTombstone(itemRemoto)) {
          mapa[itemRemoto.id] = itemRemoto
        }
      } else {
        const fechaLocal  = new Date(itemLocal.actualizadoEn  || 0)
        const fechaRemota = new Date(itemRemoto.actualizadoEn || 0)
        if (fechaRemota > fechaLocal) {
          mapa[itemRemoto.id] = itemRemoto
        }
      }
    }

    resultado[col] = Object.values(mapa).filter(item => !_esTombstone(item))
  }

  if (remoto.config?.actualizadoEn) {
    const fechaLocal  = new Date(local.config?.actualizadoEn  || 0)
    const fechaRemota = new Date(remoto.config.actualizadoEn)
    resultado.config = fechaRemota > fechaLocal ? remoto.config : local.config
  }

  return resultado
}

// ── SYNC COMPLETO ─────────────────────────────────────────────────────────────

export async function sincronizar(datosLocales, actualizarDatos) {
  const fileId = await buscarArchivo()
  const token  = await _obtenerTokenValido()

  let remoto = null
  if (fileId) {
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Drive descargarDB error ${res.status}: ${err}`)
    }
    remoto = await res.json()
  }

  const fusionado = remoto ? mergeDatos(datosLocales, remoto) : datosLocales
  await subirDB(fusionado, fileId)
  actualizarDatos(fusionado)
  return fusionado
}