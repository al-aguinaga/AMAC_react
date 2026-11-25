export const HORARIOS = ["Matutino", "Vespertino", "Medio tiempo", "Fines de semana"]
export const CATEGORIAS = ["Atención al cliente", "Administrativo", "Comercio", "Servicios", "Cuidado y apoyo"]

export const formatearFecha = (iso) =>
  new Date(iso).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })
