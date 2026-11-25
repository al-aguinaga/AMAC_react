import { Routes, Route, Link } from "react-router-dom"
import Encabezado from "./components/Encabezado"
import Pie from "./components/Pie"
import RutaProtegida from "./components/RutaProtegida"
import ListadoVacantes from "./pages/ListadoVacantes"
import DetalleVacante from "./pages/DetalleVacante"
import Login from "./pages/Login"
import RegistroCandidato from "./pages/RegistroCandidato"
import RegistroEmpresa from "./pages/RegistroEmpresa"
import MisSolicitudes from "./pages/MisSolicitudes"
import EmpresaVacantes from "./pages/EmpresaVacantes"
import PublicarVacante from "./pages/PublicarVacante"
import SolicitudesRecibidas from "./pages/SolicitudesRecibidas"

function NoEncontrada() {
  return (
    <div className="contenedor contenedor--acceso pila">
      <h1>Página no encontrada</h1>
      <p>La dirección que escribió no existe.</p>
      <Link className="boton boton--primario" to="/">Ir a las vacantes</Link>
    </div>
  )
}

export default function App() {
  return (
    <>
      <Encabezado />
      <main id="principal">
        <Routes>
          <Route path="/" element={<ListadoVacantes />} />
          <Route path="/vacantes/:id" element={<DetalleVacante />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<RegistroCandidato />} />
          <Route path="/registro-empresa" element={<RegistroEmpresa />} />
          <Route path="/mis-solicitudes" element={<RutaProtegida rol="candidato"><MisSolicitudes /></RutaProtegida>} />
          <Route path="/empresa/vacantes" element={<RutaProtegida rol="empresa"><EmpresaVacantes /></RutaProtegida>} />
          <Route path="/empresa/publicar" element={<RutaProtegida rol="empresa"><PublicarVacante /></RutaProtegida>} />
          <Route path="/empresa/solicitudes" element={<RutaProtegida rol="empresa"><SolicitudesRecibidas /></RutaProtegida>} />
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>
      <Pie />
    </>
  )
}
