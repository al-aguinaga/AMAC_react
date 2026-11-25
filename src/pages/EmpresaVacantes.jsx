import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"
import EtiquetaEstatus from "../components/EtiquetaEstatus"
import Aviso from "../components/Aviso"

export default function EmpresaVacantes() {
  const { perfil } = useAuth()
  const [vacantes, setVacantes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")

  // Mis vacantes con el número de solicitudes (RF-020, RF-021)
  async function cargar() {
    const { data, error } = await supabase
      .from("vacantes")
      .select("*, solicitudes(count)")
      .eq("empresa_id", perfil.id)
      .order("creada_en", { ascending: false })
    if (error) setError("No pudimos cargar sus vacantes.")
    else setVacantes(data)
    setCargando(false)
  }
  useEffect(() => { cargar() }, [perfil.id])

  async function cambiarEstado(id, estado) {
    const { error } = await supabase.from("vacantes").update({ estado }).eq("id", id)
    if (error) setError("No pudimos cambiar el estado de la vacante.")
    else { setError(""); cargar() }
  }

  return (
    <div className="contenedor contenedor--medio pila">
      <h1>Mis vacantes</h1>
      <div className="acciones">
        <Link className="boton boton--acento" to="/empresa/publicar">Publicar nueva vacante</Link>
      </div>
      <Aviso>{error}</Aviso>
      {cargando && <p role="status">Cargando…</p>}
      {!cargando && vacantes.length === 0 && <p className="texto-grande">Todavía no ha publicado vacantes.</p>}
      {vacantes.map((v) => (
        <article className="fila" key={v.id}>
          <div className="fila__texto">
            <h2 className="fila__titulo">{v.titulo}</h2>
            <p className="fila__detalle">{v.solicitudes[0]?.count ?? 0} solicitudes recibidas</p>
            <p><EtiquetaEstatus estatus={v.estado} /></p>
          </div>
          <div className="acciones">
            <Link className="boton boton--secundario" to={`/empresa/solicitudes?vacante=${v.id}`}>Ver solicitudes</Link>
            {v.estado === "activa" && <button type="button" className="boton boton--secundario" onClick={() => cambiarEstado(v.id, "pausada")}>Pausar</button>}
            {v.estado === "pausada" && <button type="button" className="boton boton--primario" onClick={() => cambiarEstado(v.id, "activa")}>Reactivar</button>}
            {v.estado !== "cerrada" && <button type="button" className="boton boton--secundario" onClick={() => cambiarEstado(v.id, "cerrada")}>Cerrar</button>}
          </div>
        </article>
      ))}
    </div>
  )
}
