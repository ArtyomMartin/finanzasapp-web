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
      text: "No es necesario un excel, con tus ingresos y gastos, sabras cuanto dinero tendras en los meses venideros. Calcula cuotas, planifica compras, ahorrra. Compar un nuevo movil, o capricho no tiene por que ser un gasto imprevisto o dificil de afrontar.",
    },
    {
      img: "https://placehold.co/400x260/1a1d24/7C5CFF?text=Captura+3",
      title: "Aprende a gestionarlo",
      text: "Es opcional, pero si quieres que tus ahorros crezcan facil, tienes consejos basados en tu informacion, para que sepas si gastas de mas, si ahorras poco, cuanto necesitas para estar tranquilo y mas.",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f1115",
        color: "#FFFFFF",
        fontFamily: "'Segoe UI', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "80px 24px 100px",
      }}
    >
      {/* Logo */}
      <div
        style={{
          width: "96px",
          height: "96px",
          borderRadius: "24px",
          background: "linear-gradient(135deg, #7C5CFF 0%, #A48BFF 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "28px",
          boxShadow: "0 0 48px rgba(124, 92, 255, 0.35)",
        }}
      >
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
          <path
            d="M10 36 L20 24 L28 30 L38 16"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="38" cy="16" r="4" fill="#FFFFFF" />
          <path
            d="M10 42 H42"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Título y subtítulo */}
      <h1
        style={{
          fontSize: "42px",
          fontWeight: "800",
          marginBottom: "14px",
          letterSpacing: "-0.5px",
          textAlign: "center",
        }}
      >
        FinanzasApp
      </h1>
      <p
        style={{
          color: "#C7CDD6",
          fontSize: "18px",
          lineHeight: "1.65",
          maxWidth: "520px",
          textAlign: "center",
          marginBottom: "44px",
        }}
      >
        Tu app de finanzas personales para organizar ingresos, egresos,
        inversiones y más. Sin servidores, sin suscripciones — todo en tu
        dispositivo.
      </p>

      {/* Botones de descarga */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "80px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <a
          href="[placeholder enlace windows]"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "#0078D4",
            color: "#FFFFFF",
            padding: "14px 28px",
            borderRadius: "12px",
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "15px",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M0 2.86L8.15 1.72V9.5H0V2.86ZM9.09 1.58L20 0V9.5H9.09V1.58ZM0 10.5H8.15V18.28L0 17.14V10.5ZM9.09 10.5H20V20L9.09 18.42V10.5Z" />
          </svg>
          Descargar para Windows
        </a>

        <a
          href="[placeholder enlace android]"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "#1E8E3E",
            color: "#FFFFFF",
            padding: "14px 28px",
            borderRadius: "12px",
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "15px",
            border: "1.5px solid rgba(124, 92, 255, 0.6)",
            transition: "border-color 0.2s, background-color 0.2s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "#7C5CFF";
            e.currentTarget.style.backgroundColor = "rgba(124, 92, 255, 0.1)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "rgba(124, 92, 255, 0.6)";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M1.5 6.5C1.5 5.67 2.17 5 3 5H17C17.83 5 18.5 5.67 18.5 6.5V14.5C18.5 15.33 17.83 16 17 16H3C2.17 16 1.5 15.33 1.5 14.5V6.5ZM10 17.5C10.83 17.5 11.5 16.83 11.5 16H8.5C8.5 16.83 9.17 17.5 10 17.5ZM3 3.5H17C17 3.5 14 1 10 1C6 1 3 3.5 3 3.5ZM7.5 13C8.05 13 8.5 12.55 8.5 12C8.5 11.45 8.05 11 7.5 11C6.95 11 6.5 11.45 6.5 12C6.5 12.55 6.95 13 7.5 13ZM12.5 13C13.05 13 13.5 12.55 13.5 12C13.5 11.45 13.05 11 12.5 11C11.95 11 11.5 11.45 11.5 12C11.5 12.55 11.95 13 12.5 13Z" />
          </svg>
          Descargar para Android
        </a>
      </div>

      {/* Grid de 3 imágenes/features */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "32px",
          maxWidth: "1000px",
          width: "100%",
        }}
      >
        {features.map((f, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column" }}>
            <img
              src={f.img}
              alt={f.title}
              style={{
                width: "100%",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.07)",
                display: "block",
                marginBottom: "16px",
              }}
            />
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "#FFFFFF",
                marginBottom: "8px",
              }}
            >
              {f.title}
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "#8A93A3",
                lineHeight: "1.6",
                margin: 0,
              }}
            >
              {f.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}