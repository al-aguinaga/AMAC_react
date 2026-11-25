// Etiqueta visible + control. Recibe todo por props (etiqueta, ayuda, multilinea...).
export default function Campo({ id, etiqueta, ayuda, multilinea, opciones, ...resto }) {
  const descripcion = ayuda ? `${id}-ayuda` : undefined
  return (
    <div className="campo-formulario">
      <label htmlFor={id}>{etiqueta}</label>
      {opciones ? (
        <select id={id} name={id} aria-describedby={descripcion} {...resto}>
          {opciones.map((o) => <option key={o.valor} value={o.valor}>{o.texto}</option>)}
        </select>
      ) : multilinea ? (
        <textarea id={id} name={id} aria-describedby={descripcion} {...resto} />
      ) : (
        <input id={id} name={id} aria-describedby={descripcion} {...resto} />
      )}
      {ayuda && <p className="campo-formulario__ayuda" id={descripcion}>{ayuda}</p>}
    </div>
  )
}
