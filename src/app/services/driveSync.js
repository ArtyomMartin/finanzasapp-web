import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth"

const FILE_NAME = "finanzas-db.json"

const WEB_CLIENT_ID = "588167639813-71hurbr33dvaaanmf0n47uq45olvpc16.apps.googleusercontent.com"

let accessToken = null
let _inicializado = false

// ── AUTH ──────────────────────────────────────────────────────────────────────

function _inicializarSiNecesario() {
  if (_inicializado) return
  GoogleAuth.initialize({
    clientId: WEB_CLIENT_ID,
    scopes: ["profile", "email", "https://www.googleapis.com/auth/drive.file"],
    grantOfflineAccess: false, // no usamos serverAuthCode ni client_secret
  })
  _inicializado = true
}

function _guardarToken(token, expiresInMs = 55 * 60 * 1000) {
  accessToken = token
  const expira = Date.now() + expiresInMs
  localStorage.setItem("drive-token", token)
  localStorage.setItem("drive-token-expira", expira.toString())
}

/**
 * Intenta renovar el token en dos pasos:
 *   1. GoogleAuth.refresh() — silencioso, funciona si la sesión sigue activa
 *   2. GoogleAuth.signIn()  — fallback; en dispositivos con una sola cuenta
 *      Google activa también es silencioso. Con múltiples cuentas puede
 *      mostrar el selector de cuentas (comportamiento inevitable sin backend).
 * Si ambos fallan, limpia tokens y lanza error para que la UI pida reconectar.
 */
async function _renovarToken() {
  _inicializarSiNecesario()

  // Intento 1 — refresh silencioso
  try {
    const result = await GoogleAuth.refresh()
    if (result?.accessToken) {
      _guardarToken(result.accessToken)
      return result.accessToken
    }
  } catch (_) {
    // refresh falló (sesión fría), continuamos con signIn
  }

  // Intento 2 — signIn (silencioso si hay una sola cuenta en el dispositivo)
  try {
    const user = await GoogleAuth.signIn()
    if (user?.authentication?.accessToken) {
      _guardarToken(user.authentication.accessToken)
      return user.authentication.accessToken
    }
  } catch (_) {
    // signIn también falló
  }

  // Ambos fallaron — limpiar y forzar reconexión manual
  localStorage.removeItem("drive-token")
  localStorage.removeItem("drive-token-expira")
  accessToken = null
  throw new Error("Sesión de Google expirada, vuelve a conectar Drive")
}

async function _obtenerTokenValido() {
  const expira = parseInt(localStorage.getItem("drive-token-expira") || "0")
  const margen = 3 * 60 * 1000

  if (accessToken && Date.now() < expira - margen) {
    return accessToken
  }

  return await _renovarToken()
}

export async function iniciarAuth() {
  _inicializarSiNecesario()
  const user = await GoogleAuth.signIn()

  if (!user?.authentication?.accessToken) {
    throw new Error("Google sign-in no devolvió accessToken")
  }

  _guardarToken(user.authentication.accessToken)
  return accessToken
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
 * Renueva el accessToken silenciosamente al arrancar la app.
 * Devuelve true si la sesión sigue activa, false si hay que re-login manual.
 */
export async function renovarSesionDrive() {
  if (!localStorage.getItem("drive-token")) return false
  try {
    await _renovarToken()
    return true
  } catch (_) {
    return false
  }
}

export async function cerrarSesion() {
  _inicializarSiNecesario()
  try {
    await GoogleAuth.signOut()
  } catch (_) {}
  accessToken = null
  localStorage.removeItem("drive-token")
  localStorage.removeItem("drive-token-expira")
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

  if (remoto.fondoEmergencia?.actualizadoEn) {
    const fechaLocal  = new Date(local.fondoEmergencia?.actualizadoEn  || 0)
    const fechaRemota = new Date(remoto.fondoEmergencia.actualizadoEn)
    resultado.fondoEmergencia = fechaRemota > fechaLocal ? remoto.fondoEmergencia : local.fondoEmergencia
  }

  return resultado
}

// ── SYNC COMPLETO ─────────────────────────────────────────────────────────────

export async function sincronizar(datosLocales, actualizarDatos, mergeFn = mergeDatos) {
  const fileId = await buscarArchivo()
  const token = await _obtenerTokenValido()

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

  const fusionado = remoto ? mergeFn(datosLocales, remoto) : datosLocales
  await subirDB(fusionado, fileId)
  actualizarDatos(fusionado)
  return fusionado
}