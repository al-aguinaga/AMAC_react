import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import Campo from "../components/Campo"
import Aviso from "../components/Aviso"

export default function Login() {
  const navigate = useNavigate()
  const [correo, setCorreo] = useState("")
  const [clave, setClave] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [enviando, setEnviando] = useState(false)

  // Inicio de sesión (RF-008): mensaje genérico, no se dice cuál dato falló
  async function entrar(e) {
    e.preventDefault()
    setEnviando(true)
    setMensaje("")
    const { data, error } = await supabase.auth.signInWithPassword({ email: correo, password: clave })
    if (error) { setMensaje("Correo o contraseña incorrectos."); setEnviando(false); return }
    const { data: p } = await supabase.from("perfiles").select("rol").eq("id", data.user.id).single()
    navigate(p?.rol === "empresa" ? "/empresa/vacantes" : "/")
  }

  return (
    <div className="contenedor contenedor--acceso pila">
      <h1>Iniciar sesión</h1>
      <form className="panel" onSubmit={entrar}>
        <Aviso>{mensaje}</Aviso>
        <Campo id="correo" etiqueta="Correo electrónico" type="email" autoComplete="email" required
          placeholder="nombre@correo.com" value={correo} onChange={(e) => setCorreo(e.target.value)} />
        <Campo id="clave" etiqueta="Contraseña" type="password" autoComplete="current-password" required
          placeholder="Escriba su contraseña" value={clave} onChange={(e) => setClave(e.target.value)} />
        <div className="acciones acciones--columna">
          <button type="submit" className="boton boton--primario" disabled={enviando}>Entrar</button>
        </div>
      </form>
      <section className="panel">
        <h2>¿Aún no tiene cuenta?</h2>
        <div className="acciones acciones--columna">
          <Link className="boton boton--secundario" to="/registro">Registrarme como candidato</Link>
          <Link className="boton boton--secundario" to="/registro-empresa">Registrar mi empresa</Link>
        </div>
      </section>
    </div>
  )
}
