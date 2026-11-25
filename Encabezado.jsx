import { Link, NavLink, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"

function Zigzag() {
  return (
    <svg width="44" height="22" viewBox="0 0 44 22" fill="none" aria-hidden="true">
      <path d="M3 17 L11 6 L18 15 L26 3 L33 15 L41 8" stroke="#FF815C" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Encabezado() {
  const { perfil } = useAuth()
  const navigate = useNavigate()

  async function cerrarSesion() {
    await supabase.auth.signOut() // RF-009
    navigate("/")
  }

  const enlace = (to, texto) => (
    <li><NavLink className="nav__enlace" to={to} end>{texto}</NavLink></li>
  )

  return (
    <>
      <a className="saltar-contenido" href="#principal">Saltar al contenido</a>
      <header className="encabezado">
        <div className="encabezado__interior">
          <Link className="logo" to="/"><Zigzag /><span>AMAC</span></Link>
          <nav aria-label="Navegación principal">
            <ul className="nav__lista">
              {perfil?.rol === "empresa" ? (
                <>
                  {enlace("/empresa/vacantes", "Mis vacantes")}
                  {enlace("/empresa/solicitudes", "Solicitudes recibidas")}
                </>
              ) : (
                <>
                  {enlace("/", "Vacantes")}
                  {perfil?.rol === "candidato" && enlace("/mis-solicitudes", "Mis solicitudes")}
                </>
              )}
              {perfil ? (
                <li><button type="button" className="nav__enlace" onClick={cerrarSesion}>Cerrar sesión</button></li>
              ) : (
                <>
                  {enlace("/login", "Iniciar sesión")}
                  {enlace("/registro", "Registrarme")}
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>
      <aside className="franja-ayuda" aria-label="Ayuda">
        <div className="franja-ayuda__interior">
          <p className="franja-ayuda__texto">¿Necesita ayuda? Llámenos: 81 0000 0000</p>
          <a className="boton boton--acento" href="tel:+528100000000">Llamar ahora</a>
        </div>
      </aside>
    </>
  )
}
