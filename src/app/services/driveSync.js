import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth"

const FILE_NAME = "finanzas-db.json"

let accessToken = null

// ── AUTH ──────────────────────────────────────────────────────────────────────

export async function iniciarAuth() {
  GoogleAuth.initialize({
    clientId: "588167639813-71hurbr33dvaaanmf0n47uq45olvpc16.apps.googleusercontent.com",
    scopes: ["profile", "email", "https://www.googleapis.com/auth/drive.file"],
    grantOfflineAccess: true,
  })

  const user = await GoogleAuth.signIn()
  accessToken = user.authentication.accessToken

  const expira = Date.now() + 55 * 60 * 1000
  localStorage.setItem("drive-token", accessToken)
  localStorage.setItem("drive-token-expira", expira.toString())

  return accessToken
}

export function tokenGuardado() {
  const t = localStorage.getItem("drive-token")
  const expira = parseInt(localStorage.getItem("drive-token-expira") || "0")
  if (t && Date.now() < expira) {
    accessToken = t
    return true
  }
  localStorage.removeItem("drive-token")
  localStorage.removeItem("drive-token-expira")
  return false
}

export async function cerrarSesion() {
  try {
    await GoogleAuth.signOut()
  } catch (_) {}
  accessToken = null
  localStorage.removeItem("drive-token")
  localStorage.removeItem("drive-token-expira")
}

// ── DRIVE API ─────────────────────────────────────────────────────────────────

async function buscarArchivo() {
  const query = encodeURIComponent(`name='${FILE_NAME}' and trashed=false`)
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)&spaces=drive`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
  if (!res.ok) {
    const err = await res.json()
    throw new Error(`Drive buscarArchivo error ${res.status}: ${JSON.stringify(err)}`)
  }
  const data = await res.json()
  return data.files?.[0]?.id ?? null
}

async function descargarDB() {
  const fileId = await buscarArchivo()
  if (!fileId) return null
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Drive descargarDB error ${res.status}: ${err}`)
  }
  return await res.json()
}

async function subirDB(datos) {
  const body = JSON.stringify(datos)
  const fileId = await buscarArchivo()

  if (fileId) {
    const res = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
        headers: { Authorization: `Bearer ${accessToken}` },
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

/**
 * Determina si un objeto es un tombstone de purga.
 *
 * Un tombstone es el rastro mínimo que deja purgarDatos() cuando elimina
 * un registro definitivamente. Tiene exactamente 3 campos:
 *   { id, eliminado: true, actualizadoEn }
 *
 * Su propósito es que durante el merge, si el remoto todavía tiene el
 * registro completo (porque aún no fue purgado en ese dispositivo),
 * el merge sepa que NO debe restituirlo — debe eliminarlo también.
 *
 * Una vez resuelto el conflicto, el tombstone se descarta del resultado
 * final, por lo que ni local ni remoto quedan con basura.
 *
 * IMPORTANTE: no confundir con eliminado:true normal (soft delete), que
 * sí conserva todos los campos del registro. El tombstone tiene SOLO 3 campos.
 */
function _esTombstone(item) {
  return (
    item.eliminado === true &&
    Object.keys(item).length === 3 &&
    "id" in item &&
    "actualizadoEn" in item
  )
}

/**
 * Fusiona los datos locales con los remotos (Drive o Dropbox).
 *
 * Reglas por registro:
 *  1. Existe solo en local → se queda (puede ser tombstone o registro normal)
 *  2. Existe solo en remoto:
 *     - Si es tombstone → se descarta (fue purgado localmente, no restituir)
 *     - Si es registro normal → se agrega al resultado
 *  3. Existe en ambos → gana el que tenga actualizadoEn más reciente,
 *     sea tombstone o no (si el más nuevo es tombstone, el registro muere)
 *
 *  Al final, todos los tombstones se eliminan del resultado:
 *  ya cumplieron su función de resolver conflictos y no deben persistir.
 *
 * Para agregar una colección nueva al merge, simplemente añadirla al
 * array `colecciones` — no requiere ningún otro cambio.
 */
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

    // Construimos un mapa id → item empezando por los locales
    const mapa = {}
    for (const item of localArr) {
      mapa[item.id] = item
    }

    for (const itemRemoto of remotoArr) {
      const itemLocal = mapa[itemRemoto.id]

      if (!itemLocal) {
        // El remoto tiene un registro que local no tiene.
        // Si es tombstone significa que fue purgado en otro dispositivo
        // y ya llegó al remoto — no lo restituimos.
        // Si es un registro normal, lo agregamos normalmente.
        if (!_esTombstone(itemRemoto)) {
          mapa[itemRemoto.id] = itemRemoto
        }
        // Si es tombstone: simplemente no se agrega — desaparece.
      } else {
        // Ambos tienen el registro: gana el más reciente.
        // Esto cubre el caso en que uno es tombstone y el otro no:
        // si el tombstone es más nuevo, el registro muere; si el
        // registro normal es más nuevo, el tombstone se ignora.
        const fechaLocal  = new Date(itemLocal.actualizadoEn  || 0)
        const fechaRemota = new Date(itemRemoto.actualizadoEn || 0)
        if (fechaRemota > fechaLocal) {
          mapa[itemRemoto.id] = itemRemoto
        }
      }
    }

    // Convertimos el mapa a array y descartamos tombstones del resultado final.
    // Los tombstones ya resolvieron su conflicto — no deben quedar en la DB.
    resultado[col] = Object.values(mapa).filter(item => !_esTombstone(item))
  }

  // El config también se mergea por fecha, igual que antes
  if (remoto.config?.actualizadoEn) {
    const fechaLocal  = new Date(local.config?.actualizadoEn  || 0)
    const fechaRemota = new Date(remoto.config.actualizadoEn)
    resultado.config = fechaRemota > fechaLocal ? remoto.config : local.config
  }

  return resultado
}

// ── SYNC COMPLETO ─────────────────────────────────────────────────────────────

export async function sincronizar(datosLocales, actualizarDatos) {
  if (!accessToken) throw new Error("No autenticado")
  const remoto = await descargarDB()
  const fusionado = remoto ? mergeDatos(datosLocales, remoto) : datosLocales
  await subirDB(fusionado)
  actualizarDatos(fusionado)
  return fusionado
}