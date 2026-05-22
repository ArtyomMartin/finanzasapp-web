//Consejos.jsx

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import { useDatos } from "../context/AppContext";
import DrawerMenu from "../components/DrawerMenu";
import { calcularIngresoCompartidoTotal, egresosActivosEnMes, inversionesActivasEnMes, salarioActivoEnMes, variacionActivaEnMes } from "../services/calculos";
import { NOMBRES_MESES } from "../services/formateo";
import { COLORES, estilos } from "../theme";

const REGLAS = [
  {
    pct: 0.50,
    label: "Egresos fijos",
    descripcion: "Alquiler, servicios, suscripciones y cualquier gasto fijo mensual.",
    tipo: "maximo",
    color: COLORES.peligro,
    fondo: COLORES.fondoTarjeta,
    icono: "🏠",
    clave: "egresos",
  },
  {
    pct: 0.25,
    label: "Inversiones",
    descripcion: "Acciones, fondos indexados, plazo fijo o cualquier activo que haga crecer tu dinero.",
    tipo: "minimo",
    color: COLORES.positivo,
    fondo: COLORES.fondoTarjeta,
    icono: "📈",
    clave: "inversiones",
  },
  {
    pct: 0.15,
    label: "Fondo de emergencia",
    descripcion: "Reserva líquida para imprevistos. El objetivo es cubrir de 3 a 7 meses de gastos fijos.",
    tipo: "hasta_cubrir",
    color: COLORES.advertencia,
    fondo: COLORES.fondoTarjeta,
    icono: "🛡️",
    clave: null,
  },
  {
    pct: 0.10,
    label: "Gustos personales",
    descripcion: "Ocio, salidas, caprichos. Disfruta sin culpa dentro de este límite.",
    tipo: "referencia",
    color: COLORES.primario,
    fondo: COLORES.fondoTarjeta,
    icono: "✨",
    clave: null,
  },
];

const TIPO_LABELS = {
  maximo: "máximo",
  minimo: "mínimo",
  hasta_cubrir: "hasta estar cubierto",
  referencia: "referencia",
};

export default function Consejos() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [menuAbierto, setMenuAbierto] = useState(false); 
  const { datos, fmt } = useDatos();

  const hoy = new Date();
  const [mesSeleccionado, setMesSeleccionado] = useState(hoy.getMonth() + 1);
  const [anioSeleccionado, setAnioSeleccionado] = useState(hoy.getFullYear());

  const opcionesMeses = [];
  for (let i = 0; i < 6; i++) {
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth() + i, 1);
    opcionesMeses.push({
      mes: fecha.getMonth() + 1,
      anio: fecha.getFullYear(),
      label: `${NOMBRES_MESES[fecha.getMonth()]} ${fecha.getFullYear()}`
    });
  }

  const ingresoTotal = calcularIngresoCompartidoTotal(datos, mesSeleccionado, anioSeleccionado);
  const egresosTotales = egresosActivosEnMes(datos.egresos || [], mesSeleccionado, anioSeleccionado).reduce((acc, e) => acc + e.monto, 0);
  const inversionesTotales = inversionesActivasEnMes(datos.inversiones || [], mesSeleccionado, anioSeleccionado).reduce((acc, e) => acc + e.monto, 0);
  
  const usuarios = datos.config?.usuarios || [];
  const montoFondo = datos.ubicacion?.find(c => c.id === "fondo-emergencia")?.monto || 0;

  // FIX 3: Sumamos TODOS los salarios activos del usuario (no solo el primero)
  // y TODAS sus variaciones, para reflejar salario fijo + extras correctamente.
  const detalleUsuarios = usuarios.map(u => {
    const salarios = datos.salarios || [];
    const variaciones = datos.variaciones || [];

    // salarioActivoEnMes devuelve un array filtrado; sumamos todos los montos activos
    const salariosMes = salarioActivoEnMes(salarios, u.id, mesSeleccionado, anioSeleccionado);
    const totalSalario = Array.isArray(salariosMes)
      ? salariosMes.reduce((acc, s) => acc + (s.monto || 0), 0)
      : (salariosMes?.monto || 0);

    // variacionActivaEnMes puede devolver array o un objeto; normalizamos igual
    const variacionesMes = variacionActivaEnMes(variaciones, u.id, mesSeleccionado, anioSeleccionado);
    const totalExtra = Array.isArray(variacionesMes)
      ? variacionesMes.reduce((acc, v) => acc + (v.monto || 0), 0)
      : (variacionesMes?.monto || 0);

    return {
      nombre: u.nombre,
      salario: totalSalario,
      extra: totalExtra,
      total: totalSalario + totalExtra,
    };
  });

  const sinDatos = ingresoTotal === 0;

  const realesMap = {
    egresos: egresosTotales,
    inversiones: inversionesTotales,
  };

  return (
    <div style={estilos.estiloPantalla}>

      <DrawerMenu
        abierto={menuAbierto}
        setAbierto={setMenuAbierto}
        rutaActual={location.pathname}
        alNavegar={navigate}
      />

      <div style={{ animation: "fadeIn 0.35s ease" }}>
        {/* FIX 1: título centrado — se añadió justifyContent:"center" al header
            ya que estiloHeader usa space-between; el título queda en el medio
            visualmente gracias a que el botón ☰ está fuera del flujo con position
            o simplemente centramos el h1 con flex:1 y textAlign center */}
        <div style={{ ...estilos.estiloHeader, justifyContent: "center", position: "relative" }}>
          <button
            onClick={() => setMenuAbierto(true)}
            style={{ ...estilos.estiloBotonIcono, fontSize: "24px", position: "absolute", left: "35px" }}
          >☰</button>
          <h1 style={{ ...estilos.estiloTitulo, marginBottom: 0 }}>💡 Aprende</h1>
        </div>

        <div style={{ padding: "0 0 16px" }}>

          {/* FIX 2: se añade padding interno a la tarjeta informativa para que
              el texto no quede pegado a los bordes */}
          <div style={{ ...estilos.estiloTarjeta, marginBottom: "20px", padding: "14px 16px" }}>
            <p style={{ margin: 0, fontSize: "14px", color: COLORES.textoSecundario, lineHeight: "1.6" }}>
              Una de las estrategias más efectivas para construir estabilidad financiera
              es asignar cada euro a un propósito antes de gastarlo. Esta distribución
              está basada en principios de finanzas personales ampliamente recomendados.
            </p>
          </div>

          <div style={{ marginBottom: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={estilos.estiloLabel}>Mes de análisis:</label>
            <select 
              style={{ ...estilos.estiloInput, marginBottom: 0, appearance: "none", cursor: "pointer" }}
              value={`${mesSeleccionado}-${anioSeleccionado}`}
              onChange={(e) => {
                const [m, a] = e.target.value.split("-");
                setMesSeleccionado(parseInt(m));
                setAnioSeleccionado(parseInt(a));
              }}
            >
              {opcionesMeses.map((opt, i) => (
                <option key={i} value={`${opt.mes}-${opt.anio}`}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <h2 style={{ margin: "0 0 2px 0", fontSize: "17px", fontWeight: "700", color: COLORES.textoBlanco }}>La distribución ideal</h2>
          <p style={{ margin: "0 0 12px 0", fontSize: "12px", color: COLORES.textoMuted }}>Sobre el ingreso bruto total del hogar</p>

          {REGLAS.map((r, i) => (
            <div key={i} style={{ borderRadius: "10px", padding: "12px 14px", marginBottom: "10px", backgroundColor: r.fondo, borderLeft: `4px solid ${r.color}` }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "22px", marginTop: "2px" }}>{r.icono}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "20px", fontWeight: "800", color: r.color }}>{r.pct * 100}%</span>
                    <span style={{ fontSize: "15px", fontWeight: "600", color: COLORES.textoBlanco }}>{r.label}</span>
                    <span style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", backgroundColor: COLORES.fondoOverlay, borderRadius: "4px", padding: "2px 6px", color: r.color }}>{TIPO_LABELS[r.tipo]}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: "13px", color: COLORES.textoSecundario, lineHeight: "1.5" }}>{r.descripcion}</p>
                </div>
              </div>
            </div>
          ))}

          <div style={{ height: "1px", backgroundColor: COLORES.borde, margin: "24px 0" }} />

          <h2 style={{ margin: "0 0 2px 0", fontSize: "17px", fontWeight: "700", color: COLORES.textoBlanco }}>Tu situación este mes</h2>
          <p style={{ margin: "0 0 12px 0", fontSize: "12px", color: COLORES.textoMuted }}>{NOMBRES_MESES[mesSeleccionado - 1]} {anioSeleccionado}</p>

          {sinDatos ? (
            <div style={estilos.estiloTarjeta}>
              <p style={{ margin: 0, fontSize: "14px", color: COLORES.textoMuted, lineHeight: "1.5", textAlign: "center" }}>
                No hay ingresos registrados para este mes. Cargá tus ingresos en la sección correspondiente para ver el cálculo personalizado.
              </p>
            </div>
          ) : (
            <>
              {/* FIX 2: se añade padding interno a esta tarjeta también */}
              <div style={{ ...estilos.estiloTarjeta, marginBottom: "12px", padding: "14px 16px" }}>
                <p style={{ margin: "0 0 10px 0", fontSize: "13px", color: COLORES.textoMuted, textTransform: "uppercase", letterSpacing: "0.5px" }}>Ingreso bruto del hogar</p>

                {/* FIX 3: mostramos salario + extra por usuario, y si hay 2 usuarios
                    también mostramos el subtotal de cada uno antes del total global */}
                {detalleUsuarios.map((u, i) => (
                  <div key={i} style={{ marginBottom: usuarios.length > 1 ? "10px" : "0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ fontSize: "14px", color: COLORES.textoSecundario }}>{u.nombre} — salario</span>
                      <span style={{ fontSize: "14px", fontWeight: "600", color: COLORES.textoBlanco }}>{fmt(u.salario)}</span>
                    </div>
                    {u.extra !== 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span style={{ fontSize: "14px", color: COLORES.textoSecundario }}>{u.nombre} — extra</span>
                        <span style={{ fontSize: "14px", fontWeight: "600", color: u.extra >= 0 ? COLORES.positivo : COLORES.negativo }}>
                          {u.extra >= 0 ? "+" : ""}{fmt(u.extra)}
                        </span>
                      </div>
                    )}
                    {/* Subtotal por usuario (solo si hay 2 usuarios y tiene algo) */}
                    {usuarios.length > 1 && (u.extra !== 0) && (
                      <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: "8px" }}>
                        <span style={{ fontSize: "13px", color: COLORES.textoMuted }}>Subtotal {u.nombre}</span>
                        <span style={{ fontSize: "13px", fontWeight: "600", color: COLORES.textoSecundario }}>{fmt(u.total)}</span>
                      </div>
                    )}
                  </div>
                ))}

                <div style={{ display: "flex", justifyContent: "space-between", borderTop: `1px solid ${COLORES.borde}`, marginTop: "8px", paddingTop: "8px", fontSize: "15px", fontWeight: "700", color: COLORES.textoBlanco }}>
                  <span>Total</span>
                  <span style={{ color: COLORES.positivo, fontSize: "16px" }}>{fmt(ingresoTotal)}</span>
                </div>
              </div>

              {REGLAS.map((r, i) => {
                const objetivo = ingresoTotal * r.pct;
                const real = r.clave ? realesMap[r.clave] : null;

                let estado = null;
                if (r.clave === "egresos" && real !== null) {
                  estado = real <= objetivo ? "ok" : "excede";
                } else if (r.clave === "inversiones" && real !== null) {
                  estado = real >= objetivo ? "ok" : "bajo";
                }

                const metasFondo = [
                  { label: "Mínimo (3 meses):", monto: egresosTotales * 3 },
                  { label: "Recomendado (5 meses):", monto: egresosTotales * 5 },
                  { label: "Seguro (7 meses):", monto: egresosTotales * 7 },
                ];

                return (
                  <div key={i} style={{ borderRadius: "10px", padding: "12px 14px", marginBottom: "10px", backgroundColor: r.fondo, borderLeft: `4px solid ${r.color}` }}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                      <span style={{ fontSize: "20px", marginTop: "2px" }}>{r.icono}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px", flexWrap: "wrap", gap: "4px" }}>
                          <span style={{ fontSize: "15px", fontWeight: "600", color: COLORES.textoBlanco }}>{r.label}</span>
                          <span style={{ fontSize: "15px", fontWeight: "700", color: r.color }}>
                            {TIPO_LABELS[r.tipo]}: {fmt(objetivo)}
                          </span>
                        </div>

                        {r.clave === "egresos" && real !== null && (
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px", flexWrap: "wrap", gap: "4px" }}>
                            <span style={{ fontSize: "13px", color: COLORES.textoSecundario }}>Tus egresos registrados:</span>
                            <span style={{ color: estado === "ok" ? COLORES.positivo : COLORES.negativo, fontWeight: "600" }}>
                              {fmt(real)}
                              {estado === "ok" ? " ✓" : " ⚠️ excede el límite"}
                            </span>
                          </div>
                        )}

                        {r.clave === "inversiones" && real !== null && (
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px", flexWrap: "wrap", gap: "4px" }}>
                            <span style={{ fontSize: "13px", color: COLORES.textoSecundario }}>Tus inversiones planificadas:</span>
                            <span style={{ color: estado === "ok" ? COLORES.positivo : COLORES.advertencia, fontWeight: "600" }}>
                              {fmt(real)}
                              {estado === "ok" ? " ✓" : " ⚠️ por debajo del objetivo"}
                            </span>
                          </div>
                        )}

                        {!r.clave && (
                          <>
                            <div style={{ fontSize: "13px", color: COLORES.textoSecundario, marginTop: "2px" }}>
                              Destinar {fmt(objetivo)} / mes a {r.label.toLowerCase()}
                            </div>
                            {r.label === "Fondo de emergencia" && (
                              <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: `1px solid ${COLORES.bordeBlanco}`, display: "flex", flexDirection: "column", gap: "4px" }}>
                                {metasFondo.map((m, idx) => (
                                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                                    <span style={{ color: COLORES.textoMuted }}>{m.label}</span>
                                    <span style={{ fontWeight: "600", color: montoFondo >= m.monto ? COLORES.positivo : COLORES.textoBlanco }}>
                                      {fmt(m.monto)}{montoFondo >= m.monto && " ✓"}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div style={{ backgroundColor: COLORES.fondoFondo, borderRadius: "12px", padding: "14px", marginTop: "16px", border: `1px solid ${COLORES.borde}` }}>
                <p style={{ margin: 0, fontSize: "14px", color: COLORES.textoSecundario, lineHeight: "1.6" }}>
                  💬 <strong>Tip:</strong> Estas cifras son un punto de partida, no reglas rígidas.
                  Lo importante es que cada mes tengas más claridad sobre a dónde va tu dinero.
                </p>
              </div>
            </>
          )}

          <div style={{ height: 40 }} />
        </div>
      </div>
    </div>
  );
}