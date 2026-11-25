const CLASES = {
  Aceptada: "aceptada", Rechazada: "no-seleccionada", Cancelada: "no-seleccionada",
  activa: "activa", pausada: "revision", cerrada: "cerrada",
}

export default function EtiquetaEstatus({ estatus }) {
  const clase = CLASES[estatus] ?? "revision"
  const texto = estatus.charAt(0).toUpperCase() + estatus.slice(1)
  return <span className={`etiqueta-estatus etiqueta-estatus--${clase}`}>Estado: {texto}</span>
}
