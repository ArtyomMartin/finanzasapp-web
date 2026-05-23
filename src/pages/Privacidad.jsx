export default function Privacidad() {
  return (
    <div style={{ padding: "40px 24px", display: "flex", justifyContent: "center" }}>
      <div style={{
        maxWidth: "900px",
        width: "100%",
        padding: "48px 40px",
        color: "#111111",
        lineHeight: "1.8",
        background: "rgba(255, 255, 255, 0.04)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderRadius: "16px",
        border: "1px solid rgba(255, 255, 255, 0.07)",
      }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "24px", color: "#111111" }}>Política de Privacidad</h1>

        <h2 style={{ fontSize: "20px", fontWeight: "bold", marginTop: "32px", marginBottom: "12px", color: "#111111" }}>1. INFORMACIÓN GENERAL</h2>
        <p style={{ marginBottom: "16px" }}>
          FinanzasApp es una aplicación de finanzas personales que funciona íntegramente en tu dispositivo. No dispone de servidores propios ni recopila datos de usuario. Todos los datos que introduces se almacenan exclusivamente en el almacenamiento local de tu dispositivo (localStorage).
        </p>

        <h2 style={{ fontSize: "20px", fontWeight: "bold", marginTop: "32px", marginBottom: "12px", color: "#111111" }}>2. DATOS QUE ALMACENAMOS</h2>
        <p style={{ marginBottom: "16px" }}>
          No recopilamos, transmitimos ni almacenamos ningún dato en servidores propios. Los únicos datos que existen son los que tú introduces manualmente en la app, y residen en tu dispositivo bajo la clave <code>finanzas-datos</code>.
        </p>

        <h2 style={{ fontSize: "20px", fontWeight: "bold", marginTop: "32px", marginBottom: "12px", color: "#111111" }}>3. SINCRONIZACIÓN CON GOOGLE DRIVE (OPCIONAL)</h2>
        <p style={{ marginBottom: "8px" }}>La sincronización con Google Drive es completamente opcional e iniciada por el usuario. Cuando la activas:</p>
        <ul style={{ paddingLeft: "24px", marginBottom: "16px" }}>
          <li style={{ marginBottom: "8px" }}>La app solicita acceso a Google Drive con el alcance mínimo necesario para leer y escribir un único archivo (<code>finanzas-db.json</code>) en tu Drive personal.</li>
          <li style={{ marginBottom: "8px" }}>Ese archivo contiene exclusivamente los datos financieros que tú has introducido en la app.</li>
          <li style={{ marginBottom: "8px" }}>La app no accede a ningún otro archivo ni dato de tu cuenta de Google.</li>
          <li style={{ marginBottom: "8px" }}>Los datos no son procesados, analizados ni almacenados en ningún servidor ajeno a tu propio Google Drive.</li>
          <li style={{ marginBottom: "8px" }}>Puedes revocar el acceso en cualquier momento desde la configuración de tu cuenta Google en myaccount.google.com.</li>
        </ul>
        <p style={{ marginBottom: "16px" }}>
          <strong>Declaración de uso limitado:</strong> El uso de la información recibida desde las APIs de Google se limita estrictamente a proporcionar la funcionalidad de sincronización descrita en esta política. El uso de dicha información cumple con la Google API Services User Data Policy, incluyendo los requisitos de Limited Use.
        </p>

        <h2 style={{ fontSize: "20px", fontWeight: "bold", marginTop: "32px", marginBottom: "12px", color: "#111111" }}>4. SINCRONIZACIÓN CON DROPBOX (OPCIONAL)</h2>
        <p style={{ marginBottom: "8px" }}>La sincronización con Dropbox es completamente opcional e iniciada por el usuario. Cuando la activas:</p>
        <ul style={{ paddingLeft: "24px", marginBottom: "16px" }}>
          <li style={{ marginBottom: "8px" }}>La app solicita acceso a Dropbox mediante OAuth 2.0 con PKCE, sin necesidad de contraseña.</li>
          <li style={{ marginBottom: "8px" }}>Solo se accede al archivo <code>/finanzas-db.json</code> en tu Dropbox personal.</li>
          <li style={{ marginBottom: "8px" }}>Ese archivo contiene exclusivamente los datos financieros que tú has introducido en la app.</li>
          <li style={{ marginBottom: "8px" }}>Los datos no son procesados ni almacenados en ningún servidor propio de FinanzasApp.</li>
          <li style={{ marginBottom: "8px" }}>Puedes revocar el acceso en cualquier momento desde la configuración de aplicaciones conectadas de tu cuenta Dropbox.</li>
        </ul>

        <h2 style={{ fontSize: "20px", fontWeight: "bold", marginTop: "32px", marginBottom: "12px", color: "#111111" }}>5. DATOS QUE NO RECOPILAMOS</h2>
        <p style={{ marginBottom: "8px" }}>FinanzasApp no recopila ni trata:</p>
        <ul style={{ paddingLeft: "24px", marginBottom: "16px" }}>
          <li style={{ marginBottom: "8px" }}>Datos de identificación personal (nombre, email, teléfono, etc.)</li>
          <li style={{ marginBottom: "8px" }}>Datos de localización</li>
          <li style={{ marginBottom: "8px" }}>Datos de uso o analíticas</li>
          <li style={{ marginBottom: "8px" }}>Identificadores de dispositivo</li>
          <li style={{ marginBottom: "8px" }}>Datos financieros en servidores propios</li>
        </ul>

        <h2 style={{ fontSize: "20px", fontWeight: "bold", marginTop: "32px", marginBottom: "12px", color: "#111111" }}>6. COMPARTICIÓN DE DATOS CON TERCEROS</h2>
        <p style={{ marginBottom: "16px" }}>
          No compartimos ningún dato con terceros, anunciantes, brokers de datos ni ninguna otra entidad. Los únicos servicios externos con los que la app puede interactuar son Google Drive y Dropbox, y únicamente cuando el usuario lo activa de forma explícita, tal como se describe en los apartados 3 y 4.
        </p>

        <h2 style={{ fontSize: "20px", fontWeight: "bold", marginTop: "32px", marginBottom: "12px", color: "#111111" }}>7. SEGURIDAD</h2>
        <p style={{ marginBottom: "16px" }}>
          La comunicación con las APIs de Google Drive y Dropbox se realiza siempre mediante HTTPS/TLS. Los tokens de acceso se almacenan en el almacenamiento local del dispositivo y no se transmiten a ningún servidor de FinanzasApp.
        </p>

        <h2 style={{ fontSize: "20px", fontWeight: "bold", marginTop: "32px", marginBottom: "12px", color: "#111111" }}>8. MENORES DE EDAD</h2>
        <p style={{ marginBottom: "16px" }}>
          Esta aplicación no está dirigida a menores de 13 años. No recopilamos conscientemente datos de menores. Si eres menor de 13 años, no uses esta aplicación.
        </p>

        <h2 style={{ fontSize: "20px", fontWeight: "bold", marginTop: "32px", marginBottom: "12px", color: "#111111" }}>9. CAMBIOS EN ESTA POLÍTICA</h2>
        <p style={{ marginBottom: "16px" }}>
          Esta política refleja el funcionamiento actual de la app. Cualquier cambio futuro se publicará en esta misma URL.
        </p>

        <h2 style={{ fontSize: "20px", fontWeight: "bold", marginTop: "32px", marginBottom: "12px", color: "#111111" }}>10. CONTACTO</h2>
        <p style={{ marginBottom: "16px" }}>
          Para cualquier consulta relacionada con esta política de privacidad, puedes contactar en: [tu@email.com]
        </p>
      </div>
    </div>
  );
}