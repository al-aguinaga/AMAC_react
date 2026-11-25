export default function Aviso({ tipo = "error", children }) {
  if (!children) return null
  return (
    <p role={tipo === "error" ? "alert" : "status"} className={`mensaje ${tipo === "ok" ? "mensaje--ok" : ""}`}>
      {tipo === "error" ? "Error: " : ""}{children}
    </p>
  )
}
