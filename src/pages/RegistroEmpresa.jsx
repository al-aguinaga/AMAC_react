import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import Campo from "../components/Campo"
import Aviso from "../components/Aviso"

export default function RegistroEmpresa() {
  const navigate = useNavigate()
  const [datos, setDatos] = useState({ nombre: "", giro: "", telefono: "", correo: "", clave: "" })
  const [mensaje, setMensaje] = useState("")
  const [enviando, setEnviando] = useState(false)

  const cambiar = (e) => setDatos({ ...datos, [e.target.name]: e.target.value })

  // Registro de empresa (RF-015), versión simplificada
  async function registrar(e) {
    e.preventDefault()
    setEnviando(true)
    setMensaje("")
    const { data, error } = await supabase.auth.signUp({
      email: datos.correo,
      password: datos.clave,
      options: { data: { rol: "empresa", nombre: datos.nombre, giro: datos.giro, telefono: datos.telefono } },
    })
    if (error) setMensaje(/registered/i.test(error.message) ? "Ese correo ya está registrado." : "No pudimos registrar la empresa. Revise sus datos e intente de nuevo.")
    else if (data.session) navigate("/empresa/vacantes")
    else setMensaje("Revise su correo para confirmar la cuenta.")
    setEnviando(false)
  }

  return (
    <div className="contenedor contenedor--formulario pila">
      <h1>Registrar mi empresa</h1>
      <p>Llene los datos de su empresa. Todos los campos son obligatorios.</p>
      <form className="panel" onSubmit={registrar}>
        <Aviso>{mensaje}</Aviso>
        <Campo id="nombre" etiqueta="Nombre de la empresa" autoComplete="organization" required value={datos.nombre} onChange={cambiar} />
        <Campo id="giro" etiqueta="Giro de la empresa" required ayuda="Ejemplo: restaurante, clínica, papelería." value={datos.giro} onChange={cambiar} />
        <Campo id="telefono" etiqueta="Teléfono" type="tel" autoComplete="tel" required value={datos.telefono} onChange={cambiar} />
        <Campo id="correo" etiqueta="Correo electrónico" type="email" autoComplete="email" required value={datos.correo} onChange={cambiar} />
        <Campo id="clave" etiqueta="Contraseña" type="password" autoComplete="new-password" minLength={8} required
          ayuda="Mínimo 8 caracteres." value={datos.clave} onChange={cambiar} />
        <div className="acciones">
          <button type="submit" className="boton boton--acento" disabled={enviando}>Registrar empresa</button>
        </div>
      </form>
    </div>
  )
}
