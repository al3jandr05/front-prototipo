import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import ListaVoluntarios from './pages/ListaVoluntarios';
import InfoVoluntarios from './pages/InfoVoluntarios';
import History from './pages/Historial';
import Formulario from './pages/Formulario';
import ListaEncuestas from "./pages/ListaEncuestas";
import ResultadoEncuesta from "./pages/ResultadoEncuesta";
import Dashboard from "./pages/Dashboard";
import ReportesVoluntario from "./pages/ReportesVoluntario";
import CrudCapacitaciones from "./pages/CrudCapacitaciones";
import FormularioVoluntarioView from "./pages/FormularioVoluntarioView";
import CrudNecesidades from "./pages/CrudNecesidades";
import CrudVoluntarios from "./pages/CrudVoluntarios";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/ListaVoluntarios" element={<ListaVoluntarios />} />
                <Route path="/Voluntario/:id" element={<InfoVoluntarios />} />
                <Route path="/Reportes/:id" element={<ReportesVoluntario />} />
                <Route path="/Historial/:id" element={<History />} />
                <Route path="/Formulario" element={<Formulario />} />
                <Route path="/FormularioVoluntario" element={<FormularioVoluntarioView />} />
                <Route path="/ListaEncuestas/:id" element={<ListaEncuestas />} />
                <Route path="/Capacitaciones" element={<CrudCapacitaciones />} />
                <Route path="/Necesidades" element={<CrudNecesidades />} />
                <Route path="/Voluntarios" element={<CrudVoluntarios />} />
                <Route path="/ResultadoEncuesta/:id" element={<ResultadoEncuesta />} />
            </Routes>
        </Router>
    );
}

export default App;