import React from 'react';
import '../styles/loadingCircle.css';

const LoadingCircle = () => {
    return (
        <div className="loading-fullscreen">
            <div className="loading-spinner-big"></div>
            <p className="loading-text">Cargando...</p>
        </div>
    );
};

export default LoadingCircle;
