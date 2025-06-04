import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageTitle = () => {
    const location = useLocation();

    const getPageTitle = (pathname) => {
        const routes = {
            '/': 'Login',
            '/Dashboard': 'Estadísticas',
            '/ListaVoluntarios': 'Lista de Voluntarios',
            '/Voluntario': 'Información de Voluntario',
            '/Formulario': 'Formulario',
            '/FormularioVoluntario': 'Formulario Pruebas',
            '/Capacitaciones': 'Capacitaciones',
            '/AgregarAdministrador': 'Agregar Administrador',
            '/Necesidades': 'Necesidades',
            '/Voluntarios': 'Voluntarios',
            '/ListaAdmins': 'Lista de Administradores',
            '/ResultadoEncuesta': 'Resultado de Encuesta',
            '/AyudasSolicitadas': 'Ayudas Solicitadas',
            '/Universidades': 'Universidades'
        };

        const basePath = '/' + pathname.split('/')[1];
        return routes[basePath] || 'GEVOPI';
    };

    useEffect(() => {
        document.title = getPageTitle(location.pathname);
    }, [location]);

    return null;
};

export default PageTitle; 