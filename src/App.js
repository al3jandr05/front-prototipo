import React from 'react';
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

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/ListaVoluntarios" element={<ListaVoluntarios />} />
                <Route path="/Voluntario/:id" element={<InfoVoluntarios />} />
                <Route path="/Formulario" element={<Formulario />} />
                <Route path="/FormularioVoluntario" element={<FormularioVoluntarioView />} />
                <Route path="/Capacitaciones" element={<CrudCapacitaciones />} />
                <Route path="/Necesidades" element={<CrudNecesidades />} />
                <Route path="/Voluntarios" element={<CrudVoluntarios />} />
                <Route path="/ResultadoEncuesta/:id" element={<ResultadoEncuesta />} />
            </Routes>
        </Router>
    );
}

export default App;