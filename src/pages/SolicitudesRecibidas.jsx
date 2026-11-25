import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { supabase } from "../lib/supabase"
import EtiquetaEstatus from "../components/EtiquetaEstatus"
import Aviso from "../components/Aviso"
import { formatearFecha } from "../lib/catalogos"

export default function SolicitudesRecibidas() {
  const [params] = useSearchParams()
  const vacanteId = params.get("vacante")
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")

  // Solicitudes de mis vacantes (RF-022): RLS solo entrega las de esta empresa
  async function cargar() {
    let consulta = supabase
      .from("solicitudes")
      .select("id, estatus, creada_en, vacante_id, vacante:vacantes(titulo), candidato:perfiles(nombre, edad, colonia, experiencia)")
      .neq("estatus", "Cancelada")
      .order("creada_en", { ascending: false })
    if (vacanteId) consulta = consulta.eq("vacante_id", vacanteId)
    const { data, error } = await consulta
    if (error) setError("No pudimos cargar las solicitudes.")
    else setSolicitudes(data)
    setCargando(false)
  }
  useEffect(() => { cargar() }, [vacanteId])

  // Cambiar estatus (RF-024)
  async function cambiar(id, estatus) {
    const { error } = await supabase.from("solicitudes").update({ estatus }).eq("id", id)
    if (error) setError("No pudimos cambiar el estatus.")
    else { setError(""); cargar() }
  }

  return (
    <div className="contenedor contenedor--ancho pila">
      <h1>Solicitudes recibidas</h1>
      {vacanteId && <Link className="boton boton--secundario" to="/empresa/solicitudes">Ver todas las solicitudes</Link>}
      <Aviso>{error}</Aviso>
      {cargando && <p role="status">Cargando…</p>}
      {!cargando && solicitudes.length === 0 && <p className="texto-grande">Todavía no hay solicitudes.</p>}
      {solicitudes.map((s) => (
        <article className="fila" key={s.id}>
          <div className="fila__texto">
            <h2 className="fila__titulo">{s.candidato?.nombre}</h2>
            <p className="fila__detalle">Vacante: {s.vacante?.titulo} · Enviada el {formatearFecha(s.creada_en)}</p>
            <p className="fila__detalle">Edad: {s.candidato?.edad} · Colonia: {s.candidato?.colonia}</p>
            <p>{s.candidato?.experiencia}</p>
            <p><EtiquetaEstatus estatus={s.estatus} /></p>
          </div>
          <div className="acciones">
            {["En revisión", "Aceptada", "Rechazada"].map((e) => (
              <button key={e} type="button" className={`boton boton--${e === "Aceptada" ? "primario" : "secundario"}`}
                disabled={s.estatus === e} onClick={() => cambiar(s.id, e)}>
                {e === "En revisión" ? "En revisión" : e === "Aceptada" ? "Aceptar" : "Rechazar"}
              </button>
            ))}
          </div>
        </article>
      ))}
    </div>
  )
}
