import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"
import Campo from "../components/Campo"
import Aviso from "../components/Aviso"
import { HORARIOS, CATEGORIAS } from "../lib/catalogos"

const inicial = { titulo: "", sueldo: "", ubicacion: "", horario: HORARIOS[0], categoria: CATEGORIAS[0], descripcion: "", requisitos: "", prestaciones: "" }

export default function PublicarVacante() {
  const { perfil } = useAuth()
  const navigate = useNavigate()
  const [datos, setDatos] = useState(inicial)
  const [medio, setMedio] = useState("plataforma")
  const [telefono, setTelefono] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [enviando, setEnviando] = useState(false)

  const cambiar = (e) => setDatos({ ...datos, [e.target.name]: e.target.value })

  // Publicar vacante (RF-019): el teléfono solo se guarda si elige postulaciones por teléfono
  async function publicar(e) {
    e.preventDefault()
    setEnviando(true)
    setMensaje("")
    const { error } = await supabase.from("vacantes").insert({
      ...datos,
      sueldo: Number(datos.sueldo),
      empresa_id: perfil.id,
      telefono_contacto: medio === "telefono" ? telefono : null,
    })
    if (error) { setMensaje("No pudimos publicar la vacante. Revise los datos."); setEnviando(false) }
    else navigate("/empresa/vacantes")
  }

  return (
    <div className="contenedor contenedor--formulario pila">
      <h1>Publicar vacante</h1>
      <p>Todos los campos son obligatorios.</p>
      <form className="panel" onSubmit={publicar}>
        <Aviso>{mensaje}</Aviso>
        <Campo id="titulo" etiqueta="Título del puesto" required value={datos.titulo} onChange={cambiar} />
        <Campo id="sueldo" etiqueta="Sueldo mensual (pesos)" type="number" min="1" step="0.01" required value={datos.sueldo} onChange={cambiar} />
        <Campo id="ubicacion" etiqueta="Ubicación" required ayuda="Ejemplo: Centro, Monterrey." value={datos.ubicacion} onChange={cambiar} />
        <Campo id="horario" etiqueta="Horario" value={datos.horario} onChange={cambiar} opciones={HORARIOS.map((h) => ({ valor: h, texto: h }))} />
        <Campo id="categoria" etiqueta="Categoría" value={datos.categoria} onChange={cambiar} opciones={CATEGORIAS.map((c) => ({ valor: c, texto: c }))} />
        <Campo id="descripcion" etiqueta="Qué va a hacer la persona" multilinea required value={datos.descripcion} onChange={cambiar} />
        <Campo id="requisitos" etiqueta="Qué se necesita" multilinea required value={datos.requisitos} onChange={cambiar} />
        <Campo id="prestaciones" etiqueta="Prestaciones" multilinea required value={datos.prestaciones} onChange={cambiar} />
        <fieldset className="grupo">
          <legend>¿Cómo quiere recibir postulaciones?</legend>
          <div className="opcion">
            <input type="radio" id="medio-plataforma" name="medio" checked={medio === "plataforma"} onChange={() => setMedio("plataforma")} />
            <label htmlFor="medio-plataforma">Solo por la plataforma</label>
          </div>
          <div className="opcion">
            <input type="radio" id="medio-telefono" name="medio" checked={medio === "telefono"} onChange={() => setMedio("telefono")} />
            <label htmlFor="medio-telefono">También por teléfono</label>
          </div>
        </fieldset>
        {medio === "telefono" && (
          <Campo id="telefono_contacto" etiqueta="Teléfono de contacto" type="tel" required value={telefono} onChange={(e) => setTelefono(e.target.value)} />
        )}
        <div className="acciones">
          <button type="submit" className="boton boton--acento" disabled={enviando}>Publicar vacante</button>
        </div>
      </form>
    </div>
  )
}
