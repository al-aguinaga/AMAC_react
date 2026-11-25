import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"
import EtiquetaEstatus from "../components/EtiquetaEstatus"
import Aviso from "../components/Aviso"
import { formatearFecha } from "../lib/catalogos"

export default function MisSolicitudes() {
  const { sesion } = useAuth()
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")

  // Mis solicitudes (RF-005)
  async function cargar() {
    const { data, error } = await supabase
      .from("solicitudes")
      .select("id, estatus, creada_en, vacante_id, vacante:vacantes(titulo, empresa:perfiles(nombre))")
      .eq("candidato_id", sesion.user.id)
      .order("creada_en", { ascending: false })
    if (error) setError("No pudimos cargar sus solicitudes.")
    else setSolicitudes(data)
    setCargando(false)
  }
  useEffect(() => { cargar() }, [sesion.user.id])

  // Cancelar (RF-006): pide confirmación; la base de datos impide cancelar Aceptada/Rechazada
  async function cancelar(id) {
    if (!window.confirm("¿Seguro que quiere cancelar esta solicitud?")) return
    const { error } = await supabase.from("solicitudes").update({ estatus: "Cancelada" }).eq("id", id)
    if (error) setError("No pudimos cancelar la solicitud.")
    else { setError(""); cargar() }
  }

  return (
    <div className="contenedor contenedor--medio pila">
      <h1>Mis solicitudes</h1>
      <Aviso>{error}</Aviso>
      {cargando && <p role="status">Cargando…</p>}
      {!cargando && solicitudes.length === 0 && (
        <div className="panel">
          <h2>Todavía no tiene solicitudes</h2>
          <p>Cuando se postule a una vacante, la verá aquí.</p>
          <Link className="boton boton--acento" to="/">Buscar vacantes</Link>
        </div>
      )}
      {solicitudes.map((s) => (
        <article className="fila" key={s.id}>
          <div className="fila__texto">
            <h2 className="fila__titulo">{s.vacante?.titulo}</h2>
            <p className="fila__detalle">{s.vacante?.empresa?.nombre} · Enviada el {formatearFecha(s.creada_en)}</p>
            <p><EtiquetaEstatus estatus={s.estatus} /></p>
          </div>
          <div className="acciones">
            <Link className="boton boton--secundario" to={`/vacantes/${s.vacante_id}`}>Ver vacante</Link>
            {["Enviada", "En revisión"].includes(s.estatus) && (
              <button type="button" className="boton boton--secundario" onClick={() => cancelar(s.id)}>Cancelar solicitud</button>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}
