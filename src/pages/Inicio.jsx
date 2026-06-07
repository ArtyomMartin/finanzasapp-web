export default function Inicio() {
  const features = [
    {
      title: "Conoce tus gastos fijos",
      text: "Anota tu alquiler, wifi, seguro, etc. Y ten una manera fácil, rápida y amigable de saber qué, cuánto y cuándo tienes que pagar.",
    },
    {
      title: "Conoce cuánto dinero tendrás",
      text: "Con tus ingresos y gastos sabrás cuánto dinero tendrás en los meses venideros. Calcula cuotas, planifica compras, ahorra.",
    },
    {
      title: "Aprende a gestionarlo",
      text: "Consejos basados en tu información para que sepas si gastas de más, si ahorras poco, cuánto necesitas para estar tranquilo y más.",
    },
  ];

  const C = {
    fondoApp:        "#f5f5f0",
    fondoTarjeta:    "#ffffff",
    borde:           "#1a1a1a",
    bordeClaro:      "#d4d4cc",
    texto:           "#1a1a1a",
    textoSecundario: "#555555",
    textoMuted:      "#888888",
    primario:        "#1a1a1a",
    pillBlue:        "#C2D7FF",
    pillGreen:       "#C4EFD4",
  };

  return (
    <div style={{
      padding: "60px 24px 100px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      background: C.fondoApp,
      minHeight: "100vh",
      fontFamily: "'Roboto', sans-serif",
    }}>

      {/* Hero card */}
      <div style={{
        width: "100%",
        maxWidth: "720px",
        padding: "60px 40px 52px",
        background: C.fondoTarjeta,
        borderRadius: "16px",
        border: `1px solid ${C.borde}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "16px",
      }}>

        {/* Logo */}
        <div style={{
          width: "80px",
          height: "80px",
          borderRadius: "16px",
          background: C.primario,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "24px",
          border: `1px solid ${C.borde}`,
        }}>
          <svg width="44" height="44" viewBox="0 0 52 52" fill="none">
            <path d="M10 36 L20 24 L28 30 L38 16" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="38" cy="16" r="4" fill="#ffffff" />
            <path d="M10 42 H42" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        <h1 style={{
          fontSize: "40px",
          fontWeight: "700",
          marginBottom: "12px",
          letterSpacing: "-0.5px",
          textAlign: "center",
          color: C.texto,
          fontFamily: "'Google Sans', 'Roboto', sans-serif",
        }}>
          FinanzasApp
        </h1>

        <p style={{
          color: C.textoSecundario,
          fontSize: "17px",
          lineHeight: "1.65",
          maxWidth: "500px",
          textAlign: "center",
          marginBottom: "36px",
        }}>
          Tu app de finanzas personales para organizar ingresos, egresos,
          inversiones y más. Sin servidores, sin suscripciones — todo en tu dispositivo.
        </p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <a
            href="https://www.mediafire.com/file/r9fknivmfw3mgo8/FinanzasApp-Setup.exe/file"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: C.pillBlue,
              color: C.texto,
              padding: "12px 28px",
              borderRadius: "100px",
              textDecoration: "none",
              fontWeight: "500",
              fontSize: "14px",
              border: `1px solid ${C.borde}`,
              transition: "box-shadow 0.15s, transform 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "2px 2px 0 #1a1a1a"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
          >
            Descargar para Windows
          </a>

          <a
            href="https://www.mediafire.com/file/gulbpu6vh2mkqut/FinanzasApp.apk/file"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: C.pillGreen,
              color: C.texto,
              padding: "12px 28px",
              borderRadius: "100px",
              textDecoration: "none",
              fontWeight: "500",
              fontSize: "14px",
              border: `1px solid ${C.borde}`,
              transition: "box-shadow 0.15s, transform 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "2px 2px 0 #1a1a1a"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
          >
            Descargar para Android
          </a>
        </div>
      </div>

      {/* Grid de features */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "100%",
        maxWidth: "720px",
      }}>
        {features.map((f, i) => (
          <div key={i} style={{
            background: C.fondoTarjeta,
            borderRadius: "16px",
            border: `1px solid ${C.borde}`,
            padding: "20px",
            display: "flex",
            flexDirection: "column",
          }}>
            <h3 style={{
              fontSize: "15px",
              fontWeight: "700",
              color: C.texto,
              marginBottom: "8px",
              fontFamily: "'Google Sans', 'Roboto', sans-serif",
            }}>
              {f.title}
            </h3>
            <p style={{
              fontSize: "13px",
              color: C.textoSecundario,
              lineHeight: "1.6",
              margin: 0,
            }}>
              {f.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}