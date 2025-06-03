import 'leaflet/dist/leaflet.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './pages/Login';
import ListaVoluntarios from './pages/ListaVoluntarios';
import InfoVoluntarios from './pages/InfoVoluntarios';
import Formulario from './pages/Formulario';
import ResultadoEncuesta from "./pages/ResultadoEncuesta";
import Dashboard from "./pages/Dashboard";
import CrudCapacitaciones from "./pages/CrudCapacitaciones";
import FormularioVoluntarioView from "./pages/FormularioVoluntarioView";
import CrudNecesidades from "./pages/CrudNecesidades";
import CrudVoluntarios from "./pages/CrudVoluntarios";
import AyudasSolicitadas from "./pages/AyudasSolicitadas";
import ListaAdmins from "./pages/ListaAdmins";
import AgregarAdministrador from "./pages/AgregarAdministrador";
import CrudUniversidades from "./pages/CrudUniversidades";
import Layout from './components/Layout';
import PageTitle from './components/PageTitle';
import FormularioPruebas from "./pages/FormularioPruebas";

function App() {
    return (
        <Router>
            <PageTitle />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/Dashboard" element={<Layout><Dashboard /></Layout>} />
                <Route path="/ListaVoluntarios" element={<Layout><ListaVoluntarios /></Layout>} />
                <Route path="/Voluntario/:id" element={<Layout><InfoVoluntarios /></Layout>} />
                <Route path="/Formulario" element={<Layout><Formulario /></Layout>} />
                <Route path="/FormularioVoluntario/:reporteId/:evaluacionFisicaId/:evaluacionEmocionalId" element={<FormularioVoluntarioView />} />
                <Route path="/FormularioPrueba" element={<FormularioPruebas />} />
                <Route path="/Capacitaciones" element={<Layout><CrudCapacitaciones /></Layout>} />
                <Route path="/AgregarAdministrador" element={<Layout><AgregarAdministrador /></Layout>} />
                <Route path="/Necesidades" element={<Layout><CrudNecesidades /></Layout>} />
                <Route path="/Voluntarios" element={<Layout><CrudVoluntarios /></Layout>} />
                <Route path="/ListaAdmins" element={<Layout><ListaAdmins /></Layout>} />
                <Route path="/ResultadoEncuesta/:id" element={<Layout><ResultadoEncuesta /></Layout>} />
                <Route path="/AyudasSolicitadas" element={<Layout><AyudasSolicitadas /></Layout>} />
                <Route path="/Universidades" element={<Layout><CrudUniversidades /></Layout>} />
            </Routes>
        </Router>
    );
}

export default App;
