import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

// Solo esconde pantallas: la seguridad real está en las políticas RLS de la base de datos.
export default function RutaProtegida({ rol, children }) {
  const { perfil, cargando } = useAuth()
  if (cargando) return <p role="status" className="contenedor">Cargando…</p>
  if (!perfil) return <Navigate to="/login" replace />
  if (perfil.rol !== rol) return <Navigate to="/" replace />
  return children
}
