export default function Manual() {
  const C = {
    fondoApp:        "var(--c-fondo-app)",
    fondoTarjeta:    "var(--c-fondo-tarjeta)",
    borde:           "var(--c-borde)",
    bordeClaro:      "var(--c-borde-blanco)",
    texto:           "var(--c-texto)",
    textoSecundario: "var(--c-texto-secundario)",
  };

  const h2Style = {
    fontSize: "16px",
    fontWeight: "700",
    marginTop: "36px",
    marginBottom: "10px",
    color: C.texto,
    fontFamily: "'Google Sans', 'Roboto', sans-serif",
    borderBottom: `1px solid ${C.bordeClaro}`,
    paddingBottom: "8px",
  };

  const h3Style = {
    fontSize: "14px",
    fontWeight: "700",
    marginTop: "20px",
    marginBottom: "8px",
    color: C.texto,
    fontFamily: "'Google Sans', 'Roboto', sans-serif",
  };

  const pStyle = {
    marginBottom: "14px",
    color: C.textoSecundario,
    lineHeight: "1.8",
    fontSize: "14px",
  };

  const liStyle = {
    marginBottom: "7px",
    color: C.textoSecundario,
    fontSize: "14px",
    lineHeight: "1.7",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
    fontSize: "14px",
  };

  const thStyle = {
    textAlign: "left",
    padding: "8px 12px",
    background: "var(--c-fondo-opcion, #f0f0eb)",
    color: C.texto,
    fontWeight: "600",
    border: `1px solid ${C.bordeClaro}`,
  };

  const tdStyle = {
    padding: "8px 12px",
    color: C.textoSecundario,
    border: `1px solid ${C.bordeClaro}`,
    verticalAlign: "top",
  };

  const noteStyle = {
    background: "var(--c-fondo-opcion, #f0f0eb)",
    border: `1px solid ${C.bordeClaro}`,
    borderLeft: `3px solid var(--c-primario, #1a1a1a)`,
    borderRadius: "6px",
    padding: "12px 16px",
    fontSize: "13px",
    color: C.textoSecundario,
    marginBottom: "16px",
  };

  // Generate anchor ids
  const sections = [
    { id: "primeros-pasos",        label: "1. Primeros pasos" },
    { id: "navegacion",            label: "2. Navegación" },
    { id: "inicio",                label: "3. Inicio" },
    { id: "ingresos",              label: "4. Ingresos" },
    { id: "egresos-fijos",         label: "5. Egresos fijos" },
    { id: "credito",               label: "6. Crédito" },
    { id: "mi-ahorro",             label: "7. Mi Ahorro" },
    { id: "fondo-emergencia",      label: "8. Fondo de emergencia" },
    { id: "inversiones",           label: "9. Inversiones" },
    { id: "rendimientos",          label: "10. Rendimientos" },
    { id: "resumen-mensual",       label: "11. Resumen mensual" },
    { id: "checklist-pagos",       label: "12. Checklist de pagos" },
    { id: "cuotas",                label: "13. Cuotas" },
    { id: "detalle-gastos",        label: "14. Detalle Gastos" },
    { id: "ubicacion-dinero",      label: "15. Ubicación del dinero" },
    { id: "planes-acuerdos",       label: "16. Planes y acuerdos" },
    { id: "consejos",              label: "17. Consejos" },
    { id: "ajustes",               label: "18. Ajustes" },
    { id: "dropbox",               label: "19. Sincronización con Dropbox" },
  ];

  return (
    <div style={{
      padding: "40px 24px 80px",
      display: "flex",
      justifyContent: "center",
      background: C.fondoApp,
      minHeight: "100vh",
      fontFamily: "'Roboto', sans-serif",
    }}>
      <div style={{ maxWidth: "960px", width: "100%", display: "flex", gap: "32px", alignItems: "flex-start" }}>

        {/* TOC sidebar */}
        <nav style={{
          position: "sticky",
          top: "80px",
          width: "220px",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}>
          <p style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: C.textoSecundario, marginBottom: "8px" }}>
            Índice
          </p>
          {sections.map(s => (
            <a key={s.id} href={`#${s.id}`} style={{
              fontSize: "13px",
              color: C.textoSecundario,
              textDecoration: "none",
              padding: "4px 8px",
              borderRadius: "6px",
              lineHeight: "1.5",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--c-fondo-opcion, #f0f0eb)"; e.currentTarget.style.color = C.texto; }}
            onMouseLeave={e => { e.currentTarget.style.background = ""; e.currentTarget.style.color = C.textoSecundario; }}
            >{s.label}</a>
          ))}
        </nav>

        {/* Main content */}
        <div style={{
          flex: 1,
          padding: "48px",
          background: C.fondoTarjeta,
          borderRadius: "16px",
          border: `1px solid ${C.borde}`,
          lineHeight: "1.8",
        }}>
          <h1 style={{
            fontSize: "26px",
            fontWeight: "700",
            marginBottom: "6px",
            color: C.texto,
            fontFamily: "'Google Sans', 'Roboto', sans-serif",
          }}>
            Manual de uso
          </h1>
          <p style={{ ...pStyle, marginBottom: "36px" }}>Guía completa de todas las secciones de FinanzasApp.</p>

          {/* 1 */}
          <h2 id="primeros-pasos" style={h2Style}>1. Primeros pasos</h2>
          <p style={pStyle}>Al abrir la app por primera vez sin datos previos, se presentan tres opciones:</p>
          <ul style={{ paddingLeft: "20px", marginBottom: "14px" }}>
            <li style={liStyle}><strong>Configuración inicial:</strong> para comenzar desde cero.</li>
            <li style={liStyle}><strong>Sincronizar con Dropbox:</strong> para descargar datos existentes (ver sección 19).</li>
          </ul>
          <h3 style={h3Style}>Configuración inicial (wizard)</h3>
          <p style={pStyle}>Si se elige configurar desde cero, la app guía a través de un proceso de 2 o 3 pasos:</p>
          <ol style={{ paddingLeft: "20px", marginBottom: "14px" }}>
            <li style={liStyle}><strong>¿Cuántas personas usarán la app?</strong> — 1 o 2.</li>
            <li style={liStyle}><strong>Nombres</strong> — el nombre o nombres de los usuarios.</li>
            <li style={liStyle}><strong>Reparto de gastos</strong> <em>(solo si son 2 personas)</em>:
              <ul style={{ paddingLeft: "18px", marginTop: "6px" }}>
                <li style={liStyle}><strong>50/50:</strong> cada persona paga la misma parte.</li>
                <li style={liStyle}><strong>Proporcional al salario:</strong> cada persona contribuye según el porcentaje de su salario.</li>
              </ul>
            </li>
          </ol>
          <h3 style={h3Style}>Si la app es para dos personas</h3>
          <p style={pStyle}>Cada vez que se abre la app, se pregunta <strong>¿Quién eres?</strong> para seleccionar el perfil activo. Los cálculos de netos, créditos y ahorros se hacen desde la perspectiva del usuario seleccionado.</p>

          {/* 2 */}
          <h2 id="navegacion" style={h2Style}>2. Navegación</h2>
          <p style={pStyle}>La app tiene una <strong>barra de navegación fija en la parte inferior</strong> con cuatro accesos directos:</p>
          <table style={tableStyle}>
            <thead>
              <tr><th style={thStyle}>Ícono</th><th style={thStyle}>Sección</th></tr>
            </thead>
            <tbody>
              {[
                ["Inicio", "Resumen de los próximos 12 meses"],
                ["Ahorro", "Mi Ahorro (reposiciones)"],
                ["Pagos", "Checklist de pagos del mes"],
                ["Rendim.", "Seguimiento de inversiones"],
              ].map(([ic, desc]) => (
                <tr key={ic}><td style={tdStyle}>{ic}</td><td style={tdStyle}>{desc}</td></tr>
              ))}
            </tbody>
          </table>
          <p style={pStyle}>El botón <strong>"Más"</strong> abre un panel con el resto de secciones: Ingresos, Egresos, Crédito, Fondo de emergencia, Resumen mensual, Planes, Detalle Gastos, Cuotas, Ubicación del dinero, Inversiones, Consejos y Ajustes.</p>

          {/* 3 */}
          <h2 id="inicio" style={h2Style}>3. Inicio</h2>
          <p style={pStyle}>La pantalla de inicio muestra una <strong>tabla de los próximos 12 meses</strong> con las siguientes columnas configurables:</p>
          <table style={tableStyle}>
            <thead>
              <tr><th style={thStyle}>Columna</th><th style={thStyle}>Descripción</th></tr>
            </thead>
            <tbody>
              {[
                ["Ingresos", "Total de ingresos del hogar ese mes"],
                ["Egresos", "Total de egresos fijos + inversiones planificadas + aporte al fondo de emergencia"],
                ["Neto Prov.", "Neto provisorio: lo que queda antes de descontar créditos y ahorros personales"],
                ["Ahorro/Crédito", "Total de gastos personales planificados del usuario activo (créditos + reposiciones)"],
                ["Neto Final", "Lo que le queda disponible al usuario activo para gastar libremente"],
              ].map(([col, desc]) => (
                <tr key={col}><td style={tdStyle}><strong>{col}</strong></td><td style={tdStyle}>{desc}</td></tr>
              ))}
            </tbody>
          </table>
          <p style={pStyle}>Se puede <strong>mostrar u ocultar</strong> cada columna tocando sobre su nombre en el encabezado. Al <strong>tocar sobre una fila</strong>, se abre un panel de detalle con el desglose de créditos, reposiciones y neto final.</p>

          {/* 4 */}
          <h2 id="ingresos" style={h2Style}>4. Ingresos</h2>
          <p style={pStyle}>Aquí se registran todos los ingresos. Hay dos tipos:</p>
          <h3 style={h3Style}>Salario</h3>
          <p style={pStyle}>Ingreso recurrente que se repite todos los meses desde una fecha de inicio hasta una fecha de fin (o indefinidamente). Se puede indicar un nombre o fuente opcional y definir mes de inicio y fin.</p>
          <h3 style={h3Style}>Extra</h3>
          <p style={pStyle}>Ingreso puntual de un mes concreto. Ejemplos: paga extra, incentivo, venta ocasional.</p>
          <h3 style={h3Style}>Compartido vs. Individual <em>(solo si hay 2 usuarios)</em></h3>
          <ul style={{ paddingLeft: "20px", marginBottom: "14px" }}>
            <li style={liStyle}><strong>Compartido:</strong> entra al pool conjunto y se reparte según la configuración.</li>
            <li style={liStyle}><strong>Individual:</strong> va directamente al bolsillo de ese usuario sin entrar en el reparto.</li>
          </ul>
          <h3 style={h3Style}>Gestión de ingresos</h3>
          <p style={pStyle}>Al tocar sobre un ingreso registrado, aparecen tres acciones: <strong>Finalizar</strong> (asigna fecha de fin), <strong>Editar</strong> y <strong>Eliminar</strong>.</p>

          {/* 5 */}
          <h2 id="egresos-fijos" style={h2Style}>5. Egresos fijos</h2>
          <p style={pStyle}>Son los <strong>gastos recurrentes del hogar</strong>: alquiler, luz, internet, seguro, suscripciones, etc. Se comparten entre todos los usuarios.</p>
          <p style={pStyle}>Cada egreso tiene nombre, monto, frecuencia (mensual o semanal), mes de inicio y mes de fin opcional. Al tocar un egreso se puede <strong>asignar fecha de fin</strong>, <strong>editar</strong> el monto (el historial se conserva) o <strong>eliminar</strong>.</p>

          {/* 6 */}
          <h2 id="credito" style={h2Style}>6. Crédito</h2>
          <p style={pStyle}>Se usa para registrar <strong>compras aplazadas o con tarjeta de crédito</strong> distribuidas en el tiempo. Cada registro se carga al usuario activo y descuenta de su neto final en los meses activos. No afecta el neto de la otra persona.</p>
          <p style={pStyle}>Al crear un crédito se indica: nombre del gasto, monto total o por cuota, número de cuotas y mes de inicio.</p>

          {/* 7 */}
          <h2 id="mi-ahorro" style={h2Style}>7. Mi Ahorro</h2>
          <p style={pStyle}>Sirve para <strong>planificar ahorros personales</strong>. Tiene dos usos principales:</p>
          <h3 style={h3Style}>Objetivo de ahorro futuro</h3>
          <p style={pStyle}>Quiero ahorrar cierta cantidad en un plazo determinado. Ejemplo: 1.200 € para un móvil en 12 meses → 100 €/mes descontados del neto final.</p>
          <h3 style={h3Style}>Reposición de dinero ya gastado</h3>
          <p style={pStyle}>Se usó dinero de la hucha y se quiere devolver. Ejemplo: 300 € en 3 meses (100 €/mes). A efectos de cálculo, ambos casos funcionan igual.</p>

          {/* 8 */}
          <h2 id="fondo-emergencia" style={h2Style}>8. Fondo de emergencia</h2>
          <p style={pStyle}>Reserva para cubrir gastos imprevistos (recomendado: entre 3 y 7 meses de gastos). Desde esta sección se activa y se configura el aporte mensual como <strong>porcentaje</strong> de los ingresos compartidos o como <strong>cantidad fija</strong>.</p>
          <p style={pStyle}>Una vez activo, el aporte aparece automáticamente en los cálculos y en el checklist de pagos. El saldo real del fondo debe actualizarse manualmente en la sección <strong>Ubicación del dinero</strong>.</p>

          {/* 9 */}
          <h2 id="inversiones" style={h2Style}>9. Inversiones</h2>
          <p style={pStyle}>Aquí se registra <strong>cuánto se planifica invertir por mes</strong>: importe, fecha de inicio y fecha de fin opcional. Este monto se descuenta de los egresos del hogar igual que un egreso fijo.</p>

          {/* 10 */}
          <h2 id="rendimientos" style={h2Style}>10. Rendimientos</h2>
          <p style={pStyle}>Esta sección es para <strong>hacer seguimiento de las inversiones reales</strong>: saldo inicial del mes, aporte, inflación, rentabilidad, etc. Es el registro histórico, independiente de la planificación. Los datos deben cargarse manualmente.</p>

          {/* 11 */}
          <h2 id="resumen-mensual" style={h2Style}>11. Resumen mensual</h2>
          <p style={pStyle}>Muestra una <strong>tabla de los próximos 24 meses</strong> con el neto final del usuario activo. Al tocar un mes se abre el desglose: neto provisorio, créditos activos (con número de cuota), reposiciones activas y neto final. Desde el detalle también se pueden eliminar créditos o reposiciones.</p>

          {/* 12 */}
          <h2 id="checklist-pagos" style={h2Style}>12. Checklist de pagos</h2>
          <p style={pStyle}>Lista todos los <strong>pagos que corresponden a un mes concreto</strong>: egresos fijos, inversiones y aporte al fondo de emergencia, ordenados de mayor a menor. Se puede marcar cada ítem como pagado. Los botones del encabezado permiten cambiar el mes visualizado.</p>
          <div style={noteStyle}>Los estados de "pagado" son temporales y se reinician al cerrar la app. Sirven como ayuda visual durante la sesión.</div>

          {/* 13 */}
          <h2 id="cuotas" style={h2Style}>13. Cuotas</h2>
          <p style={pStyle}>Muestra un <strong>listado de todas las cuotas futuras</strong> de créditos y reposiciones activos, ordenadas cronológicamente. Útil para tener una visión global de los compromisos de pago.</p>

          {/* 14 */}
          <h2 id="detalle-gastos" style={h2Style}>14. Detalle Gastos</h2>
          <p style={pStyle}>Permite ver un <strong>desglose de los gastos personales</strong> (créditos y reposiciones) de un mes concreto, con el detalle de cada ítem activo en ese mes.</p>

          {/* 15 */}
          <h2 id="ubicacion-dinero" style={h2Style}>15. Ubicación del dinero</h2>
          <p style={pStyle}>Registro manual de <strong>dónde está el dinero</strong>: cuentas bancarias, efectivo, hucha, etc. Cada entrada tiene un nombre y un saldo. Si el fondo de emergencia está activo, aparece como una entrada protegida cuyo saldo se actualiza manualmente.</p>

          {/* 16 */}
          <h2 id="planes-acuerdos" style={h2Style}>16. Planes y acuerdos</h2>
          <p style={pStyle}>Una sección de <strong>notas compartidas</strong> para anotar acuerdos entre usuarios, metas a largo plazo, decisiones tomadas o recordatorios. Cada nota tiene título, fecha de referencia y texto libre, ordenadas por fecha.</p>

          {/* 17 */}
          <h2 id="consejos" style={h2Style}>17. Consejos</h2>
          <p style={pStyle}>Muestra una <strong>guía de distribución recomendada</strong> de los ingresos:</p>
          <table style={tableStyle}>
            <thead>
              <tr><th style={thStyle}>Destino</th><th style={thStyle}>Recomendación</th></tr>
            </thead>
            <tbody>
              {[
                ["Gastos fijos (alquiler, alimentación, seguros…)", "No más del 50 %"],
                ["Inversión", "Al menos 25 %"],
                ["Fondo de emergencia", "Al menos 15 %"],
                ["Gastos libres (gustos)", "10 %"],
              ].map(([dest, rec]) => (
                <tr key={dest}><td style={tdStyle}>{dest}</td><td style={tdStyle}>{rec}</td></tr>
              ))}
            </tbody>
          </table>
          <p style={pStyle}>Estos porcentajes son orientativos. No todos los hogares pueden cumplirlos desde el inicio; sirven como referencia.</p>

          {/* 18 */}
          <h2 id="ajustes" style={h2Style}>18. Ajustes</h2>
          <p style={pStyle}>Desde aquí se puede:</p>
          <ul style={{ paddingLeft: "20px", marginBottom: "14px" }}>
            <li style={liStyle}>Ver y modificar los nombres de los usuarios.</li>
            <li style={liStyle}>Cambiar el modo de reparto de gastos (50/50 o proporcional).</li>
            <li style={liStyle}>Cambiar el tema visual de la app.</li>
            <li style={liStyle}>Gestionar la sincronización con Dropbox (conectar o desconectar).</li>
          </ul>

          {/* 19 */}
          <h2 id="dropbox" style={h2Style}>19. Sincronización con Dropbox</h2>
          <p style={pStyle}>La app permite sincronizar los datos con <strong>Dropbox</strong> para tener una copia de seguridad en la nube y compartir datos entre dispositivos.</p>
          <h3 style={h3Style}>Primera configuración</h3>
          <ol style={{ paddingLeft: "20px", marginBottom: "14px" }}>
            <li style={liStyle}>En la pantalla de bienvenida (o desde Ajustes), tocar <strong>Sincronizar con Dropbox</strong>.</li>
            <li style={liStyle}>Se abrirá la pantalla de inicio de sesión de Dropbox. Si no se tiene cuenta, se puede crear una gratis.</li>
            <li style={liStyle}>Una vez autorizado, la app descarga o sube los datos automáticamente.</li>
          </ol>
          <h3 style={h3Style}>Si la app es para dos personas</h3>
          <ol style={{ paddingLeft: "20px", marginBottom: "14px" }}>
            <li style={liStyle}>La primera persona hace la configuración inicial y sincroniza con Dropbox.</li>
            <li style={liStyle}>La segunda persona elige <strong>Sincronizar con Dropbox</strong> con la misma cuenta en su dispositivo.</li>
            <li style={liStyle}>A partir de ahí, ambas tienen los mismos datos.</li>
          </ol>
          <h3 style={h3Style}>Sincronización automática</h3>
          <p style={pStyle}>Una vez conectada, la app sincroniza automáticamente al abrirse. El estado se indica con un ícono en la esquina superior derecha:</p>
          <table style={tableStyle}>
            <thead>
              <tr><th style={thStyle}>Ícono</th><th style={thStyle}>Significado</th></tr>
            </thead>
            <tbody>
              {[
                ["Nube", "Conectado, al día"],
                ["Flechas girando", "Sincronizando"],
                ["Tilde verde", "Sincronización completada"],
                ["Nube con X", "Sin conexión a Dropbox"],
              ].map(([ic, desc]) => (
                <tr key={ic}><td style={tdStyle}>{ic}</td><td style={tdStyle}>{desc}</td></tr>
              ))}
            </tbody>
          </table>
          <p style={pStyle}>Se puede forzar una sincronización manual tocando ese ícono en cualquier momento.</p>
        </div>
      </div>
    </div>
  );
}
