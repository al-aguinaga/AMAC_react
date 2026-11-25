import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"
import Aviso from "../components/Aviso"

export default function DetalleVacante() {
  const { id } = useParams()
  const { sesion, perfil } = useAuth()
  const [vacante, setVacante] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [mensaje, setMensaje] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [postulada, setPostulada] = useState(false)

  useEffect(() => {
    let activo = true
    supabase.from("vacantes").select("*, empresa:perfiles(nombre)").eq("id", id).maybeSingle()
      .then(({ data }) => { if (activo) { setVacante(data); setCargando(false) } })
    return () => { activo = false }
  }, [id])

  // Postularme (RF-004, RF-054): la base de datos decide si se permite
  async function postularme() {
    setEnviando(true)
    setMensaje(null)
    const { error } = await supabase.from("solicitudes").insert({ vacante_id: vacante.id, candidato_id: sesion.user.id })
    if (error?.code === "23505") setMensaje({ tipo: "error", texto: "Ya se postuló a esta vacante." })
    else if (error?.code === "42501") setMensaje({ tipo: "error", texto: "Su registro aún no ha sido aprobado por AMAC. Por favor espere." })
    else if (error) setMensaje({ tipo: "error", texto: "No pudimos enviar su solicitud. Intente de nuevo." })
    else { setMensaje({ tipo: "ok", texto: "¡Listo! Su solicitud fue enviada." }); setPostulada(true) }
    setEnviando(false)
  }

  if (cargando) return <p role="status" className="contenedor">Cargando…</p>
  if (!vacante) {
    return (
      <div className="contenedor contenedor--estrecho pila">
        <h1>Vacante no encontrada</h1>
        <Link className="boton boton--secundario" to="/">Volver a vacantes</Link>
      </div>
    )
  }

  return (
    <div className="contenedor contenedor--estrecho pila">
      <Link className="boton boton--secundario" to="/">Volver a vacantes</Link>
      <h1>{vacante.titulo}</h1>
      <p className="subtitulo">{vacante.empresa?.nombre}</p>
      <ul className="panel lista-datos">
        <li><strong>Ubicación:</strong> {vacante.ubicacion}</li>
        <li><strong>Horario:</strong> {vacante.horario}</li>
        <li><strong>Categoría:</strong> {vacante.categoria}</li>
        <li><strong>Sueldo:</strong> ${Number(vacante.sueldo).toLocaleString("es-MX")} al mes</li>
      </ul>
      <section><h2>Qué va a hacer</h2><p>{vacante.descripcion}</p></section>
      <section><h2>Qué se necesita</h2><p>{vacante.requisitos}</p></section>
      <section><h2>Prestaciones</h2><p>{vacante.prestaciones}</p></section>

      {mensaje && <Aviso tipo={mensaje.tipo}>{mensaje.texto}</Aviso>}
      <div className="acciones">
        {perfil?.rol === "candidato" && (
          <button type="button" className="boton boton--acento" onClick={postularme} disabled={enviando || postulada}>
            Postularme
          </button>
        )}
        {!sesion && <Link className="boton boton--acento" to="/login">Inicie sesión para postularse</Link>}
        {postulada && <Link className="boton boton--primario" to="/mis-solicitudes">Ver mis solicitudes</Link>}
        {/* RF-051: el botón Llamar solo aparece si la vacante tiene teléfono */}
        {vacante.telefono_contacto && (
          <a className="boton boton--secundario" href={`tel:${vacante.telefono_contacto.replace(/[^\d+]/g, "")}`}>
            Llamar a la empresa
          </a>
        )}
      </div>
    </div>
  )
}
