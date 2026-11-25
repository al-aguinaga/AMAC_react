import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import TarjetaVacante from "../components/TarjetaVacante"
import Campo from "../components/Campo"
import Aviso from "../components/Aviso"
import { HORARIOS, CATEGORIAS } from "../lib/catalogos"

const todos = [{ valor: "", texto: "Todos" }]

export default function ListadoVacantes() {
  const [vacantes, setVacantes] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [horario, setHorario] = useState("")
  const [categoria, setCategoria] = useState("")
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")

  // Se vuelve a consultar cada vez que cambia la búsqueda o un filtro (RF-001, RF-002, RF-007)
  useEffect(() => {
    let activo = true
    async function cargar() {
      setCargando(true)
      let consulta = supabase
        .from("vacantes")
        .select("*, empresa:perfiles(nombre)")
        .eq("estado", "activa")
        .order("creada_en", { ascending: false })
      const limpia = busqueda.replace(/[,()%*]/g, " ").trim()
      if (limpia) consulta = consulta.or(`titulo.ilike.%${limpia}%,ubicacion.ilike.%${limpia}%`)
      if (horario) consulta = consulta.eq("horario", horario)
      if (categoria) consulta = consulta.eq("categoria", categoria)
      const { data, error } = await consulta
      if (!activo) return
      if (error) setError("No pudimos cargar las vacantes. Intente de nuevo.")
      else { setError(""); setVacantes(data) }
      setCargando(false)
    }
    cargar()
    return () => { activo = false }
  }, [busqueda, horario, categoria])

  return (
    <div className="contenedor pila">
      <h1>Vacantes disponibles</h1>
      <section className="panel" aria-label="Buscar y filtrar vacantes">
        <Campo id="buscar" etiqueta="¿Qué trabajo busca?" type="search" placeholder="Escriba el puesto o la ubicación"
          value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        <div className="filtros">
          <Campo id="horario" etiqueta="Horario" value={horario} onChange={(e) => setHorario(e.target.value)}
            opciones={[...todos, ...HORARIOS.map((h) => ({ valor: h, texto: h }))]} />
          <Campo id="categoria" etiqueta="Categoría" value={categoria} onChange={(e) => setCategoria(e.target.value)}
            opciones={[...todos, ...CATEGORIAS.map((c) => ({ valor: c, texto: c }))]} />
        </div>
      </section>
      <Aviso>{error}</Aviso>
      {cargando && <p role="status" className="texto-grande">Cargando vacantes…</p>}
      {!cargando && !error && vacantes.length === 0 && <p className="texto-grande"><strong>No hay vacantes para mostrar.</strong></p>}
      {!cargando && vacantes.length > 0 && <p className="texto-grande"><strong>Mostrando {vacantes.length} vacantes</strong></p>}
      <div className="lista-vacantes">
        {vacantes.map((v) => <TarjetaVacante key={v.id} vacante={v} />)}
      </div>
    </div>
  )
}
