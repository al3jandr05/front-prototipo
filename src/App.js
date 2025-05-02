import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import ListaVoluntarios from './pages/ListaVoluntarios';
import InfoVoluntarios from './pages/InfoVoluntarios';
import History from './pages/Historial';
import Formulario from './pages/Formulario';
import ListaResultados from "./pages/ListaResultados";
import ResultadoVoluntario from "./pages/ResultadoVoluntario";
import Dashboard from "./pages/Dashboard";
import ReportesVoluntario from "./pages/ReportesVoluntario";
import Capacitaciones from "./pages/Capacitaciones";

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
                <Route path="/ListaResultados" element={<ListaResultados />} />
                <Route path="/Capacitaciones" element={<Capacitaciones />} />
                <Route path="/ResultadoVoluntario/:id" element={<ResultadoVoluntario />} />
            </Routes>
        </Router>
    );
}

export default App;