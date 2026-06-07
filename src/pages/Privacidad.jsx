export default function Privacidad() {
  const C = {
    fondoApp:        "#f5f5f0",
    fondoTarjeta:    "#ffffff",
    borde:           "#1a1a1a",
    bordeClaro:      "#d4d4cc",
    texto:           "#1a1a1a",
    textoSecundario: "#555555",
    primario:        "#1a1a1a",
  };

  const h2Style = {
    fontSize: "16px",
    fontWeight: "700",
    marginTop: "32px",
    marginBottom: "10px",
    color: C.texto,
    fontFamily: "'Google Sans', 'Roboto', sans-serif",
    borderBottom: `1px solid ${C.bordeClaro}`,
    paddingBottom: "8px",
  };

  const pStyle = {
    marginBottom: "16px",
    color: C.textoSecundario,
    lineHeight: "1.8",
    fontSize: "14px",
  };

  const liStyle = {
    marginBottom: "8px",
    color: C.textoSecundario,
    fontSize: "14px",
  };

  const codeStyle = {
    color: C.texto,
    background: "#f0f0eb",
    padding: "2px 6px",
    borderRadius: "4px",
    fontSize: "13px",
    border: `1px solid ${C.bordeClaro}`,
    fontFamily: "'Roboto Mono', monospace",
  };

  return (
    <div style={{
      padding: "40px 24px 80px",
      display: "flex",
      justifyContent: "center",
      background: C.fondoApp,
      minHeight: "100vh",
      fontFamily: "'Roboto', sans-serif",
    }}>
      <div style={{
        maxWidth: "860px",
        width: "100%",
        padding: "48px 48px",
        background: C.fondoTarjeta,
        borderRadius: "16px",
        border: `1px solid ${C.borde}`,
        lineHeight: "1.8",
      }}>
        <h1 style={{
          fontSize: "26px",
          fontWeight: "700",
          marginBottom: "8px",
          color: C.texto,
          fontFamily: "'Google Sans', 'Roboto', sans-serif",
        }}>
          Política de Privacidad
        </h1>
        <p style={{ ...pStyle, marginBottom: "32px" }}>
          Última actualización: 2025
        </p>

        <h2 style={h2Style}>1. INFORMACIÓN GENERAL</h2>
        <p style={pStyle}>
          FinanzasApp es una aplicación de finanzas personales que funciona íntegramente en tu dispositivo. No dispone de servidores propios ni recopila datos de usuario. Todos los datos que introduces se almacenan exclusivamente en el almacenamiento local de tu dispositivo (localStorage).
        </p>

        <h2 style={h2Style}>2. DATOS QUE ALMACENAMOS</h2>
        <p style={pStyle}>
          No recopilamos, transmitimos ni almacenamos ningún dato en servidores propios. Los únicos datos que existen son los que tú introduces manualmente en la app, y residen en tu dispositivo bajo la clave <code style={codeStyle}>finanzas-datos</code>.
        </p>

        <h2 style={h2Style}>3. SINCRONIZACIÓN CON GOOGLE DRIVE (OPCIONAL)</h2>
        <p style={pStyle}>La sincronización con Google Drive es completamente opcional e iniciada por el usuario. Cuando la activas:</p>
        <ul style={{ paddingLeft: "24px", marginBottom: "16px" }}>
          <li style={liStyle}>La app solicita acceso a Google Drive con el alcance mínimo necesario para leer y escribir un único archivo (<code style={codeStyle}>finanzas-db.json</code>) en tu Drive personal.</li>
          <li style={liStyle}>Ese archivo contiene exclusivamente los datos financieros que tú has introducido en la app.</li>
          <li style={liStyle}>La app no accede a ningún otro archivo ni dato de tu cuenta de Google.</li>
          <li style={liStyle}>Los datos no son procesados, analizados ni almacenados en ningún servidor ajeno a tu propio Google Drive.</li>
          <li style={liStyle}>Puedes revocar el acceso en cualquier momento desde myaccount.google.com.</li>
        </ul>
        <p style={pStyle}>
          <strong>Declaración de uso limitado:</strong> El uso de la información recibida desde las APIs de Google se limita estrictamente a proporcionar la funcionalidad de sincronización descrita en esta política, cumpliendo con la Google API Services User Data Policy y los requisitos de Limited Use.
        </p>

        <h2 style={h2Style}>4. SINCRONIZACIÓN CON DROPBOX (OPCIONAL)</h2>
        <p style={pStyle}>La sincronización con Dropbox es completamente opcional e iniciada por el usuario. Cuando la activas:</p>
        <ul style={{ paddingLeft: "24px", marginBottom: "16px" }}>
          <li style={liStyle}>La app solicita acceso a Dropbox mediante OAuth 2.0 con PKCE, sin necesidad de contraseña.</li>
          <li style={liStyle}>Solo se accede al archivo <code style={codeStyle}>/finanzas-db.json</code> en tu Dropbox personal.</li>
          <li style={liStyle}>Los datos no son procesados ni almacenados en ningún servidor propio de FinanzasApp.</li>
          <li style={liStyle}>Puedes revocar el acceso desde la configuración de aplicaciones conectadas de tu cuenta Dropbox.</li>
        </ul>

        <h2 style={h2Style}>5. DATOS QUE NO RECOPILAMOS</h2>
        <p style={pStyle}>FinanzasApp no recopila ni trata:</p>
        <ul style={{ paddingLeft: "24px", marginBottom: "16px" }}>
          <li style={liStyle}>Datos de identificación personal (nombre, email, teléfono, etc.)</li>
          <li style={liStyle}>Datos de localización</li>
          <li style={liStyle}>Datos de uso o analíticas</li>
          <li style={liStyle}>Identificadores de dispositivo</li>
          <li style={liStyle}>Datos financieros en servidores propios</li>
        </ul>

        <h2 style={h2Style}>6. COMPARTICIÓN DE DATOS CON TERCEROS</h2>
        <p style={pStyle}>
          No compartimos ningún dato con terceros, anunciantes ni ninguna otra entidad. Los únicos servicios externos con los que la app puede interactuar son Google Drive y Dropbox, y únicamente cuando el usuario lo activa de forma explícita.
        </p>

        <h2 style={h2Style}>7. SEGURIDAD</h2>
        <p style={pStyle}>
          La comunicación con las APIs de Google Drive y Dropbox se realiza siempre mediante HTTPS/TLS. Los tokens de acceso se almacenan en el almacenamiento local del dispositivo y no se transmiten a ningún servidor de FinanzasApp.
        </p>

        <h2 style={h2Style}>8. MENORES DE EDAD</h2>
        <p style={pStyle}>
          Esta aplicación no está dirigida a menores de 13 años. No recopilamos conscientemente datos de menores.
        </p>

        <h2 style={h2Style}>9. CAMBIOS EN ESTA POLÍTICA</h2>
        <p style={pStyle}>
          Esta política refleja el funcionamiento actual de la app. Cualquier cambio futuro se publicará en esta misma URL.
        </p>

        <h2 style={h2Style}>10. CONTACTO</h2>
        <p style={pStyle}>
          Para cualquier consulta: [tu@email.com]
        </p>
      </div>
    </div>
  );
}