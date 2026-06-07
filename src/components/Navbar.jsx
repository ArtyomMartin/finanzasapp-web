import { Link, useLocation } from "react-router-dom"

const links = [
  { to: "/", label: "Inicio" },
  { to: "/app", label: "App online" },
  { to: "/privacidad", label: "Privacidad" },
]

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav style={{
      display: "flex",
      gap: "8px",
      padding: "12px 24px",
      borderBottom: "1px solid #1a1a1a",
      background: "#f5f5f0",
      position: "sticky",
      top: 0,
      zIndex: 100,
      fontFamily: "'Roboto', sans-serif",
    }}>
      {links.map(l => {
        const active = pathname === l.to || (l.to !== "/" && pathname.startsWith(l.to))
        return (
          <Link key={l.to} to={l.to} style={{
            padding: "7px 16px",
            borderRadius: "100px",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "500",
            border: "1px solid #1a1a1a",
            background: active ? "#C2D7FF" : "#ffffff",
            color: "#1a1a1a",
            transition: "box-shadow 0.15s, transform 0.15s",
          }}
          onMouseEnter={e => { if (!active) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "2px 2px 0 #1a1a1a"; }}}
          onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
          >{l.label}</Link>
        )
      })}
    </nav>
  )
}