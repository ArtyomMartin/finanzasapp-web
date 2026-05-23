export default function Inicio() {
  const features = [
    {
      img: "https://placehold.co/400x260/1a1d24/7C5CFF?text=Captura+1",
      title: "Conoce tus gastos fijos",
      text: "Anota tu alquiler, wifi, seguro, etc. Y ten una manera facil, rapida y amigable de saber que, cuanto y cuando tienes que pagar.",
    },
    {
      img: "https://placehold.co/400x260/1a1d24/A48BFF?text=Captura+2",
      title: "Conoce cuanto dinero tendras",
      text: "No es necesario un excel, con tus ingresos y gastos, sabras cuanto dinero tendras en los meses venideros. Calcula cuotas, planifica compras, ahorra. Comprar un nuevo movil o capricho no tiene por que ser un gasto imprevisto o dificil de afrontar.",
    },
    {
      img: "https://placehold.co/400x260/1a1d24/7C5CFF?text=Captura+3",
      title: "Aprende a gestionarlo",
      text: "Es opcional, pero si quieres que tus ahorros crezcan facil, tienes consejos basados en tu informacion, para que sepas si gastas de mas, si ahorras poco, cuanto necesitas para estar tranquilo y mas.",
    },
  ];

  return (
    <div style={{ padding: "60px 24px 100px", display: "flex", flexDirection: "column", alignItems: "center" }}>

      {/* Card principal con blur */}
      <div style={{
        width: "100%",
        padding: "60px 40px 52px",
        background: "rgba(255, 255, 255, 0.04)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderRadius: "20px",
        border: "1px solid rgba(255, 255, 255, 0.07)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "24px",
      }}>

        {/* Logo */}
        <div style={{
          width: "96px", height: "96px", borderRadius: "24px",
          background: "linear-gradient(135deg, #7C5CFF 0%, #A48BFF 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "28px",
          boxShadow: "0 0 48px rgba(124, 92, 255, 0.35)",
        }}>
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
            <path d="M10 36 L20 24 L28 30 L38 16" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="38" cy="16" r="4" fill="#FFFFFF" />
            <path d="M10 42 H42" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Título */}
        <h1 style={{
          fontSize: "42px", fontWeight: "800", marginBottom: "14px",
          letterSpacing: "-0.5px", textAlign: "center", color: "#000000",
        }}>
          FinanzasApp
        </h1>

        {/* Subtítulo */}
        <p style={{
          color: "#333333", fontSize: "18px", lineHeight: "1.65",
          maxWidth: "520px", textAlign: "center", marginBottom: "40px",
        }}>
          Tu app de finanzas personales para organizar ingresos, egresos,
          inversiones y más. Sin servidores, sin suscripciones — todo en tu dispositivo.
        </p>

        {/* Botones */}
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
          <a
            href="https://www.mediafire.com/file/r9fknivmfw3mgo8/FinanzasApp-Setup.exe/file"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(0, 120, 212, 0.15)",
              backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
              color: "#60b4ff", padding: "14px 32px", borderRadius: "12px",
              textDecoration: "none", fontWeight: "600", fontSize: "15px",
              border: "1px solid rgba(0, 120, 212, 0.35)",
              boxShadow: "0 0 24px rgba(0, 120, 212, 0.2)",
              transition: "box-shadow 0.2s, background 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(0, 120, 212, 0.25)";
              e.currentTarget.style.boxShadow = "0 0 36px rgba(0, 120, 212, 0.35)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(0, 120, 212, 0.15)";
              e.currentTarget.style.boxShadow = "0 0 24px rgba(0, 120, 212, 0.2)";
            }}
          >
            Descargar para Windows
          </a>

          <a
            href="https://www.mediafire.com/file/gulbpu6vh2mkqut/FinanzasApp.apk/file"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(30, 142, 62, 0.15)",
              backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
              color: "#4ade80", padding: "14px 32px", borderRadius: "12px",
              textDecoration: "none", fontWeight: "600", fontSize: "15px",
              border: "1px solid rgba(30, 142, 62, 0.35)",
              boxShadow: "0 0 24px rgba(30, 142, 62, 0.2)",
              transition: "box-shadow 0.2s, background 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(30, 142, 62, 0.25)";
              e.currentTarget.style.boxShadow = "0 0 36px rgba(30, 142, 62, 0.35)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(30, 142, 62, 0.15)";
              e.currentTarget.style.boxShadow = "0 0 24px rgba(30, 142, 62, 0.2)";
            }}
          >
            Descargar para Android
          </a>
        </div>
      </div>

      {/* Grid de features — cada card con su propio blur */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "16px",
        width: "100%",
      }}>
        {features.map((f, i) => (
          <div key={i} style={{
            background: "rgba(255, 255, 255, 0.04)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.07)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
          }}>
            <img
              src={f.img}
              alt={f.title}
              style={{
                width: "100%", borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.07)",
                display: "block", marginBottom: "16px",
              }}
            />
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#000000", marginBottom: "8px" }}>
              {f.title}
            </h3>
            <p style={{ fontSize: "14px", color: "#444444", lineHeight: "1.6", margin: 0 }}>
              {f.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}