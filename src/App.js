import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import ListaVoluntarios from './pages/ListaVoluntarios';
import InfoVoluntarios from './pages/InfoVoluntarios';
import History from './pages/Historial';
import Formulario from './pages/Formulario';
import ListaResultados from "./pages/ListaResultados";
import ResultadoVoluntario from "./pages/ResultadoVoluntario";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/ListaVoluntarios" element={<ListaVoluntarios />} />
                <Route path="/Voluntario/:id" element={<InfoVoluntarios />} />
                <Route path="/Historial/:id" element={<History />} />
                <Route path="/Formulario" element={<Formulario />} />
                <Route path="/ListaResultados" element={<ListaResultados />} />
                <Route path="/ResultadoVoluntario/:id" element={<ResultadoVoluntario />} />
            </Routes>
        </Router>
    );
}

export default App;
