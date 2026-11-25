import { useState } from "react"
import { Link } from "react-router-dom"
import { supabase } from "../lib/supabase"
import Campo from "../components/Campo"
import Aviso from "../components/Aviso"

const vacio = { nombre: "", correo: "", clave: "", telefono: "", edad: "", colonia: "", experiencia: "" }

export default function RegistroCandidato() {
  const [datos, setDatos] = useState(vacio)
  const [terminos, setTerminos] = useState(false)
  const [mensaje, setMensaje] = useState("")
  const [listo, setListo] = useState(false)
  const [enviando, setEnviando] = useState(false)

  const cambiar = (e) => setDatos({ ...datos, [e.target.name]: e.target.value })

  // Registro (RF-011): los datos extra viajan en options.data y el trigger crear_perfil() los guarda
  async function registrar(e) {
    e.preventDefault()
    setEnviando(true)
    setMensaje("")
    const { error } = await supabase.auth.signUp({
      email: datos.correo,
      password: datos.clave,
      options: { data: { rol: "candidato", nombre: datos.nombre, telefono: datos.telefono, edad: datos.edad, colonia: datos.colonia, experiencia: datos.experiencia } },
    })
    if (error) setMensaje(/registered/i.test(error.message) ? "Ese correo ya está registrado." : "No pudimos crear su cuenta. Revise sus datos e intente de nuevo.")
    else setListo(true)
    setEnviando(false)
  }

  if (listo) {
    return (
      <div className="contenedor contenedor--acceso pila">
        <h1>Cuenta creada</h1>
        <Aviso tipo="ok">AMAC debe aprobar su registro antes de que pueda postularse a una vacante. Mientras tanto, puede ver todas las vacantes.</Aviso>
        <Link className="boton boton--primario" to="/">Ver vacantes</Link>
      </div>
    )
  }

  return (
    <div className="contenedor contenedor--formulario pila">
      <h1>Crear cuenta de candidato</h1>
      <p>Llene sus datos. Todos los campos son obligatorios.</p>
      <form className="panel" onSubmit={registrar}>
        <Aviso>{mensaje}</Aviso>
        <Campo id="nombre" etiqueta="Nombre completo" autoComplete="name" required value={datos.nombre} onChange={cambiar} />
        <Campo id="correo" etiqueta="Correo electrónico" type="email" autoComplete="email" required value={datos.correo} onChange={cambiar} />
        <Campo id="clave" etiqueta="Contraseña" type="password" autoComplete="new-password" minLength={8} required
          ayuda="Mínimo 8 caracteres." value={datos.clave} onChange={cambiar} />
        <Campo id="telefono" etiqueta="Teléfono" type="tel" autoComplete="tel" required value={datos.telefono} onChange={cambiar} />
        <Campo id="edad" etiqueta="Edad" type="number" min="18" max="120" required value={datos.edad} onChange={cambiar} />
        <Campo id="colonia" etiqueta="Colonia" autoComplete="address-level3" required value={datos.colonia} onChange={cambiar} />
        <Campo id="experiencia" etiqueta="¿En qué ha trabajado?" multilinea required
          ayuda="Ejemplo: recepcionista durante 10 años." value={datos.experiencia} onChange={cambiar} />
        <div className="opcion">
          <input type="checkbox" id="terminos" required checked={terminos} onChange={(e) => setTerminos(e.target.checked)} />
          <label htmlFor="terminos">Acepto los términos y condiciones</label>
        </div>
        <div className="acciones">
          <button type="submit" className="boton boton--acento" disabled={enviando}>Crear mi cuenta</button>
        </div>
      </form>
    </div>
  )
}
