import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"
import Campo from "../components/Campo"
import Aviso from "../components/Aviso"

// Editar perfil de candidato (RF-014) y de empresa (RF-017).
// La base de datos solo deja cambiar nombre, teléfono, edad, colonia, experiencia y giro:
// nadie puede cambiarse el rol ni el campo "aprobado".
export default function Perfil() {
  const { sesion } = useAuth()
  const [datos, setDatos] = useState(null)
  const [rol, setRol] = useState("")
  const [aprobado, setAprobado] = useState(false)
  const [mensaje, setMensaje] = useState(null)
  const [guardando, setGuardando] = useState(false)

  // Se lee el perfil actualizado desde la base de datos cada vez que se abre la página
  useEffect(() => {
    supabase.from("perfiles").select("*").eq("id", sesion.user.id).single()
      .then(({ data, error }) => {
        if (error) { setMensaje({ tipo: "error", texto: "No pudimos cargar su perfil." }); return }
        setRol(data.rol)
        setAprobado(data.aprobado)
        setDatos({
          nombre: data.nombre ?? "", telefono: data.telefono ?? "", edad: data.edad ?? "",
          colonia: data.colonia ?? "", experiencia: data.experiencia ?? "", giro: data.giro ?? "",
        })
      })
  }, [sesion.user.id])

  const cambiar = (e) => setDatos({ ...datos, [e.target.name]: e.target.value })

  async function guardar(e) {
    e.preventDefault()
    setGuardando(true)
    setMensaje(null)
    const cambios = rol === "empresa"
      ? { nombre: datos.nombre, giro: datos.giro, telefono: datos.telefono }
      : { nombre: datos.nombre, telefono: datos.telefono, edad: Number(datos.edad), colonia: datos.colonia, experiencia: datos.experiencia }
    const { error } = await supabase.from("perfiles").update(cambios).eq("id", sesion.user.id)
    if (error) setMensaje({ tipo: "error", texto: "No pudimos guardar los cambios. Revise los datos." })
    else setMensaje({ tipo: "ok", texto: "Sus datos se guardaron." })
    setGuardando(false)
  }

  if (!datos) return <div className="contenedor">{mensaje ? <Aviso>{mensaje.texto}</Aviso> : <p role="status">Cargando…</p>}</div>

  return (
    <div className="contenedor contenedor--formulario pila">
      <h1>{rol === "empresa" ? "Perfil de la empresa" : "Mi perfil"}</h1>
      <ul className="panel lista-datos">
        <li><strong>Correo electrónico:</strong> {sesion.user.email}</li>
        {rol === "candidato" && (
          <li><strong>Registro:</strong> {aprobado ? "Aprobado por AMAC" : "Pendiente de aprobación por AMAC"}</li>
        )}
      </ul>
      <form className="panel" onSubmit={guardar}>
        {mensaje && <Aviso tipo={mensaje.tipo}>{mensaje.texto}</Aviso>}
        <Campo id="nombre" etiqueta={rol === "empresa" ? "Nombre de la empresa" : "Nombre completo"} required value={datos.nombre} onChange={cambiar} />
        {rol === "empresa" && <Campo id="giro" etiqueta="Giro de la empresa" required value={datos.giro} onChange={cambiar} />}
        <Campo id="telefono" etiqueta="Teléfono" type="tel" required value={datos.telefono} onChange={cambiar} />
        {rol === "candidato" && (
          <>
            <Campo id="edad" etiqueta="Edad" type="number" min="18" max="120" required value={datos.edad} onChange={cambiar} />
            <Campo id="colonia" etiqueta="Colonia" required value={datos.colonia} onChange={cambiar} />
            <Campo id="experiencia" etiqueta="¿En qué ha trabajado?" multilinea required value={datos.experiencia} onChange={cambiar} />
          </>
        )}
        <div className="acciones">
          <button type="submit" className="boton boton--acento" disabled={guardando}>Guardar cambios</button>
        </div>
      </form>
    </div>
  )
}
