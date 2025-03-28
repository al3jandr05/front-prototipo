import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import ListaVoluntarios from './pages/ListaVoluntarios';
import InfoVoluntarios from './pages/InfoVoluntarios';
import History from './pages/Historial';
import Formulario from './pages/Formulario';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/ListaVoluntarios" element={<ListaVoluntarios />} />
                <Route path="/voluntario/:id" element={<InfoVoluntarios />} />
                <Route path="/historial/:id" element={<History />} />
                <Route path="/formulario" element={<Formulario />} />
            </Routes>
        </Router>
    );
}

export default App;
