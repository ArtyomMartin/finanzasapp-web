import { useState } from "react"

const C = {
  bg: "#0f1115", panel: "#181c23", card: "#1e2330", border: "#2a2f3d",
  primario: "#7C5CFF", primarioSuave: "rgba(124,92,255,0.13)",
  positivo: "#3DDC97", negativo: "#FF6B6B", advertencia: "#F5A623",
  texto: "#FFFFFF", textoSec: "#C7CDD6", textoMuted: "#8A93A3",
}

const meses = [
  { mes: "Jun 2026", prov: "€1.350", gastos: "€1.020", final: "€330" },
  { mes: "Jul 2026", prov: "€1.350", gastos: "€1.090", final: "€260" },
  { mes: "Ago 2026", prov: "€1.350", gastos: "€1.020", final: "€330" },
  { mes: "Sep 2026", prov: "€1.350", gastos: "€1.020", final: "€330" },
  { mes: "Oct 2026", prov: "€1.350", gastos: "€1.090", final: "€260" },
  { mes: "Nov 2026", prov: "€1.350", gastos: "€1.020", final: "€330" },
]

function BadgeMensual() {
  return <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 5, whiteSpace: "nowrap", background: C.card, color: C.negativo, border: `1px solid ${C.negativo}` }}>Mensual</span>
}
function BadgeSemanal() {
  return <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 5, whiteSpace: "nowrap", background: C.card, color: C.advertencia, border: `1px solid ${C.advertencia}` }}>Semanal</span>
}
function BadgeSalario() {
  return <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 5, whiteSpace: "nowrap", background: C.card, color: C.positivo, border: `1px solid ${C.positivo}` }}>Salario</span>
}
function BadgeEgreso() {
  return <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 5, whiteSpace: "nowrap", background: C.card, color: C.negativo, border: `1px solid ${C.negativo}` }}>Egreso</span>
}

function Header({ onMenu, title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 20, gap: 10 }}>
      <button onClick={onMenu} style={{ background: "none", border: "none", color: C.primario, fontSize: 22, cursor: "pointer", padding: 4, lineHeight: 1 }}>☰</button>
      <span style={{ fontSize: 18, fontWeight: 700, color: C.texto }}>{title}</span>
    </div>
  )
}

function ScreenHome({ onMenu }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 24px" }}>
      <Header onMenu={onMenu} title="FinanzasApp" />
      <p style={{ fontSize: 11, color: C.textoMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Próximos 6 meses</p>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", padding: "8px 12px", borderBottom: `1px solid ${C.border}` }}>
          {["Mes", "Neto Prov.", "Gastos", "Neto Final"].map((h, i) => (
            <span key={i} style={{ fontSize: 10, color: C.textoMuted, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: i > 0 ? "right" : "left" }}>{h}</span>
          ))}
        </div>
        {meses.map((m, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", padding: "10px 12px", borderBottom: i < 5 ? `1px solid ${C.border}` : "none" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.texto }}>{m.mes}</span>
            <span style={{ fontSize: 12, color: C.positivo, textAlign: "right" }}>{m.prov}</span>
            <span style={{ fontSize: 12, color: C.negativo, textAlign: "right" }}>{m.gastos}</span>
            <span style={{ fontSize: 12, color: C.positivo, textAlign: "right" }}>{m.final}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 11, color: C.textoMuted, textAlign: "center", marginTop: 8, fontStyle: "italic" }}>Toca una fila para ver el desglose</p>
    </div>
  )
}

function ScreenIngresos({ onMenu }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 24px" }}>
      <Header onMenu={onMenu} title="💰 Ingresos" />
      <p style={{ fontSize: 11, color: C.textoMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Total ingresos este mes</p>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {[{ nombre: "[Usuario 1]", monto: "€1.200" }, { nombre: "[Usuario 2]", monto: "€600" }].map((u, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px", flex: 1 }}>
            <div style={{ fontSize: 13, color: C.textoSec }}>{u.nombre}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.positivo, marginTop: 2 }}>{u.monto}</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 11, color: C.textoMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Ingresos registrados</p>
      {[{ usuario: "[Usuario 1]", monto: "€1.200" }, { usuario: "[Usuario 2]", monto: "€600" }].map((u, i) => (
        <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <BadgeSalario />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.texto }}>{u.usuario}</div>
                <div style={{ fontSize: 11, color: C.textoMuted, marginTop: 2 }}>Trabajo principal · desde Jun 2026</div>
              </div>
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: C.positivo }}>{u.monto}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function ScreenEgresos({ onMenu }) {
  const items = [
    { badge: <BadgeMensual />, nombre: "Alquiler", sub: "Jun 2026 → Sin fin", extra: null, monto: "€700" },
    { badge: <BadgeSemanal />, nombre: "Comida", sub: "Jun 2026 → Sin fin", extra: "€70 × 4 lunes", monto: "€280" },
    { badge: <BadgeMensual />, nombre: "Wifi", sub: "Jun 2026 → Sin fin", extra: null, monto: "€40" },
  ]
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 24px" }}>
      <Header onMenu={onMenu} title="💸 Egresos fijos" />
      <p style={{ fontSize: 11, color: C.textoMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Egresos activos</p>
      {items.map((item, i) => (
        <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {item.badge}
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.texto }}>{item.nombre}</div>
                <div style={{ fontSize: 11, color: C.textoMuted, marginTop: 2 }}>{item.sub}</div>
                {item.extra && <div style={{ fontSize: 10, color: C.advertencia, marginTop: 2 }}>{item.extra}</div>}
              </div>
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: C.negativo }}>{item.monto}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function ScreenPagos({ onMenu }) {
  const items = [
    { nombre: "Alquiler", sub: "Recurrente · desde Jun 2026", monto: "€700", extra: null },
    { nombre: "Comida", sub: "Recurrente · desde Jun 2026", monto: "€280", extra: "(4 lunes)" },
    { nombre: "Wifi", sub: "Recurrente · desde Jun 2026", monto: "€40", extra: null },
  ]
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 24px" }}>
      <Header onMenu={onMenu} title="Hacer Pagos" />
      <div style={{ display: "flex", borderRadius: 10, border: `1px solid ${C.border}`, background: C.card, overflow: "hidden", marginBottom: 16 }}>
        {["Mes anterior", "Mes actual", "Mes siguiente"].map((label, i) => (
          <button key={i} style={{ flex: 1, padding: "10px 6px", fontSize: 12, fontWeight: 700, border: "none", cursor: "default", borderRight: i < 2 ? `1px solid ${C.border}` : "none", background: i === 1 ? C.primarioSuave : "transparent", color: i === 1 ? C.texto : C.textoMuted, borderBottom: i === 1 ? `2px solid ${C.primario}` : "2px solid transparent" }}>{label}</button>
        ))}
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.texto }}>Junio 2026</div>
          <div style={{ fontSize: 11, color: C.textoMuted, marginTop: 2 }}>0 de 3 pagados</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, color: C.textoMuted, marginBottom: 2 }}>Pagado: <span style={{ color: C.positivo, fontWeight: 700 }}>€0</span></div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.negativo }}>€1.020 total</div>
        </div>
      </div>
      <div style={{ background: C.primarioSuave, borderLeft: `3px solid ${C.primario}`, borderRadius: 8, padding: "10px 12px", fontSize: 11, color: C.textoSec, lineHeight: 1.5, marginBottom: 14 }}>
        💡 Marcar como pagado es solo visual y no se guarda. Al salir o cambiar de mes se resetea.
      </div>
      <p style={{ fontSize: 11, color: C.textoMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Egresos del mes</p>
      {items.map((item, i) => (
        <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <div style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${C.border}`, flexShrink: 0 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
            <BadgeEgreso />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.texto }}>
                {item.nombre}
                {item.extra && <span style={{ fontSize: 10, color: C.advertencia, marginLeft: 5, fontWeight: 400 }}>{item.extra}</span>}
              </div>
              <div style={{ fontSize: 11, color: C.textoMuted, marginTop: 2 }}>{item.sub}</div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.negativo }}>{item.monto}</div>
            <div style={{ fontSize: 10, color: C.textoMuted }}>Pendiente</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function SimuladorBasico() {
  const [pantalla, setPantalla] = useState("home")
  const [drawerAbierto, setDrawerAbierto] = useState(false)

  const navItems = [
    { id: "home", label: "🏠 Inicio", section: "Principal" },
    { id: "ingresos", label: "💰 Ingresos", section: "Básico" },
    { id: "egresos", label: "💸 Egresos fijos", section: null },
    { id: "pagos", label: "✅ Hacer Pagos", section: null },
  ]

  function goTo(page) {
    setPantalla(page)
    setDrawerAbierto(false)
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "2rem 0" }}>
      <div style={{ width: 360, height: 640, background: C.bg, borderRadius: 28, border: `2px solid ${C.border}`, overflow: "hidden", position: "relative", display: "flex", flexDirection: "column", boxShadow: "0 8px 40px rgba(0,0,0,0.5)" }}>

        {drawerAbierto && (
          <div onClick={() => setDrawerAbierto(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 10 }} />
        )}

        <div style={{ position: "absolute", top: 0, left: drawerAbierto ? 0 : -260, width: 260, height: "100%", background: C.panel, borderRight: `1px solid ${C.border}`, zIndex: 11, transition: "left 0.25s ease", display: "flex", flexDirection: "column", borderRadius: "0 16px 16px 0" }}>
          <div style={{ padding: "28px 20px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 17, fontWeight: 700, color: C.texto }}>FinanzasApp</span>
            <button onClick={() => setDrawerAbierto(false)} style={{ background: "none", border: "none", color: C.textoMuted, fontSize: 18, cursor: "pointer" }}>✕</button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
            {navItems.map((item) => (
              <div key={item.id}>
                {item.section && (
                  <div style={{ padding: "12px 20px 4px", fontSize: 10, color: C.textoMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>{item.section}</div>
                )}
                <button onClick={() => goTo(item.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 20px", cursor: "pointer", background: pantalla === item.id ? C.primarioSuave : "none", border: "none", width: "100%", textAlign: "left", color: pantalla === item.id ? C.primario : C.textoSec, fontSize: 14 }}>
                  {item.label}
                </button>
              </div>
            ))}
            <div style={{ padding: "12px 20px 4px", fontSize: 10, color: C.textoMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>App</div>
            <button onClick={() => setDrawerAbierto(false)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 20px", cursor: "pointer", background: "none", border: "none", width: "100%", textAlign: "left", color: C.textoSec, fontSize: 14 }}>⚙️ Ajustes</button>
          </div>
        </div>

        {pantalla === "home" && <ScreenHome onMenu={() => setDrawerAbierto(true)} />}
        {pantalla === "ingresos" && <ScreenIngresos onMenu={() => setDrawerAbierto(true)} />}
        {pantalla === "egresos" && <ScreenEgresos onMenu={() => setDrawerAbierto(true)} />}
        {pantalla === "pagos" && <ScreenPagos onMenu={() => setDrawerAbierto(true)} />}

      </div>
    </div>
  )
}