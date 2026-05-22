// AppContext.jsx — refactorizado
// fmt ahora viene de src/services/formateo.js

import { createContext, useContext, useState, useEffect, useRef } from "react"
import { tokenGuardadoDropbox, sincronizarDropbox } from "../services/dropboxSync"
import { tokenGuardado, sincronizar, mergeDatos } from "../services/driveSync"
import { fmt as fmtBase } from "../services/formateo"
import { aplicarTema } from "../theme/colores"

const AppContext = createContext()

export const PAISES = {
  ES: { nombre: "España", simbolo: "€", locale: "es-ES", label: "🇪🇸 España" },
  AR: { nombre: "Argentina", simbolo: "$", locale: "es-AR", label: "🇦🇷 Argentina" },
}

export const NIVELES = {
  basico:   { label: "Básico",   descripcion: "Ingresos, egresos y pagos" },
  medio:    { label: "Medio",    descripcion: "+ Crédito, reposiciones, gustos y planes" },
  avanzado: { label: "Avanzado", descripcion: "Todo disponible" },
}

export const RUTAS_POR_NIVEL = {
  basico:   ["/", "/ingresos", "/egresos", "/hacer-pagos", "/ajustes"],
  medio:    ["/", "/ingresos", "/egresos", "/hacer-pagos", "/credito", "/detalle-gastos", "/reposicion", "/gustos", "/planes", "/ajustes"],
  avanzado: null,
}

const ESTRUCTURA_BASE = {
  config: {
    version: 1,
    numUsuarios: 2,
    usuarios: [
      { id: "usuario1", nombre: "Usuario 1" },
      { id: "usuario2", nombre: "Usuario 2" }
    ],
    reparto: "igual",
    pais: "ES",
    nivelSeguimiento: "avanzado",
    tema: "original",
  },
  salarios: [],
  variaciones: [],
  egresos: [],
  ajustes: [],
  planes: [],
  ubicacion: [],
  inversiones: [],
  cuentasInversion: [],
  fondoEmergencia: {
    activo: false,
    tipo: "porcentaje",
    valor: 0,
    mesesObjetivo: 3,
    mesInicio: null,
    anioInicio: null,
  },
  extra1: [],
  extra2: [],
  extra3: []
}

function datosValidos(datos) {
  return (
    datos &&
    datos.config?.version === 1 &&
    Array.isArray(datos.salarios) &&
    Array.isArray(datos.variaciones) &&
    Array.isArray(datos.egresos) &&
    Array.isArray(datos.ajustes)
  )
}

function cargarDatos() {
  try {
    const guardado = localStorage.getItem("finanzas-datos")
    if (guardado) {
      const parsed = JSON.parse(guardado)
      if (datosValidos(parsed)) {
        if (!Array.isArray(parsed.ubicacion))        parsed.ubicacion = []
        if (!Array.isArray(parsed.inversiones))      parsed.inversiones = []
        if (!Array.isArray(parsed.cuentasInversion)) parsed.cuentasInversion = []
        if (!parsed.config.pais)                     parsed.config.pais = "ES"
        if (!parsed.config.nivelSeguimiento)         parsed.config.nivelSeguimiento = "avanzado"
        if (!parsed.config.tema)                     parsed.config.tema = "original"

        if (!parsed.fondoEmergencia) {
          parsed.fondoEmergencia = {
            activo: false, tipo: "porcentaje", valor: 0,
            mesesObjetivo: 3, mesInicio: null, anioInicio: null,
          }
        }

        if (parsed.fondoEmergencia.activo) {
          const yaExiste = parsed.ubicacion.find(c => c.id === "fondo-emergencia")
          if (!yaExiste) {
            parsed.ubicacion.push({
              id: "fondo-emergencia",
              nombre: "Fondo de emergencia",
              monto: 0,
              protegido: true,
              creadoEn: new Date().toISOString()
            })
          }
        }

        parsed.egresos = parsed.egresos.map(e => e.frecuencia ? e : { ...e, frecuencia: "m" })
        return parsed
      }
    }
  } catch (e) {
    console.warn("Error cargando datos, usando estructura base:", e)
  }
  localStorage.removeItem("finanzas-datos")
  return null
}

function cargarUsuarioActivo() {
  return null
}

export function AppProvider({ children }) {
  const [datosIniciales] = useState(cargarDatos)
  const [datos, setDatos] = useState(datosIniciales)
  const [usuarioActivo, setUsuarioActivoState] = useState(cargarUsuarioActivo)
  const [syncInicialEstado, setSyncInicialEstado] = useState("idle")
  const datosRef = useRef(datos)
  useEffect(() => { datosRef.current = datos }, [datos])

  // ── Aplicar tema al arrancar y cada vez que cambie ──────────────────────
  useEffect(() => {
    const tema = datos?.config?.tema || "original"
    aplicarTema(tema)
  }, [datos?.config?.tema])

  // ── Persistencia local ──────────────────────────────────────────────────
  useEffect(() => {
    if (datos && datosValidos(datos)) {
      localStorage.setItem("finanzas-datos", JSON.stringify(datos))
    } else {
      localStorage.removeItem("finanzas-datos")
    }
  }, [datos])

  // ── Sync automático al arrancar ─────────────────────────────────────────
  useEffect(() => {
    if (!navigator.onLine) return

    async function syncAlArrancar() {
      setSyncInicialEstado("syncing")
      try {
        if (tokenGuardadoDropbox()) {
          await sincronizarDropbox(datosIniciales, actualizarDatos, mergeDatos)
          setSyncInicialEstado("ok")
          return
        }
        if (tokenGuardado()) {
          await sincronizar(datosIniciales, actualizarDatos)
          setSyncInicialEstado("ok")
          return
        }
        setSyncInicialEstado("idle")
      } catch (e) {
        console.warn("Sync inicial fallido:", e)
        setSyncInicialEstado("error")
      }
    }

    syncAlArrancar()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function actualizarDatos(nuevosDatos) {
    setDatos(nuevosDatos)
  }

  function cambiarTema(nuevoTema) {
    const nuevosDatos = {
      ...datos,
      config: { ...datos.config, tema: nuevoTema }
    }
    actualizarDatos(nuevosDatos)
  }

  function setUsuarioActivo(id) {
    if (id) { localStorage.setItem("finanzas-usuario-activo", id) }
    else     { localStorage.removeItem("finanzas-usuario-activo") }
    setUsuarioActivoState(id)
  }

  function hayDB() {
    return datos !== null && datosValidos(datos)
  }

  const pais     = datos?.config?.pais || "ES"
  const paisInfo = PAISES[pais] || PAISES.ES
  const simbolo  = paisInfo.simbolo
  const locale   = paisInfo.locale

  function fmt(n) {
    return fmtBase(n, locale, simbolo)
  }

  const nivel = datos?.config?.nivelSeguimiento || "avanzado"
  const tema  = datos?.config?.tema || "original"

  function rutaPermitida(ruta) {
    const permitidas = RUTAS_POR_NIVEL[nivel]
    if (permitidas === null) return true
    return permitidas.includes(ruta)
  }

  return (
    <AppContext.Provider value={{
      datos, actualizarDatos,
      usuarioActivo, setUsuarioActivo,
      hayDB,
      simbolo, locale, fmt,
      nivel, rutaPermitida,
      paisInfo,
      syncInicialEstado,
      tema, cambiarTema,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useDatos() {
  return useContext(AppContext)
}