import { Link } from "react-router-dom"

export default function TarjetaVacante({ vacante }) {
  return (
    <article className="tarjeta-vacante">
      <h3 className="tarjeta-vacante__titulo">{vacante.titulo}</h3>
      <p className="tarjeta-vacante__empresa">{vacante.empresa?.nombre}</p>
      <ul className="tarjeta-vacante__datos">
        <li><strong>Sueldo:</strong> ${Number(vacante.sueldo).toLocaleString("es-MX")} mensuales</li>
        <li><strong>Ubicación:</strong> {vacante.ubicacion}</li>
        <li><strong>Horario:</strong> {vacante.horario}</li>
      </ul>
      <Link className="boton boton--primario" to={`/vacantes/${vacante.id}`}>Ver vacante</Link>
    </article>
  )
}
