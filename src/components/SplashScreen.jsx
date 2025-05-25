import React, { useEffect } from 'react';
import '../styles/splash.css';

const SplashScreen = ({ onFinish }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onFinish(); // gllama navigate justo después del fadeOut
        }, );
        return () => clearTimeout(timer);
    }, [onFinish]);


    return (
        <div className="splash-overlay">
            <h1 className="splash-title">GEVOPI</h1>
            <div className="spinner"></div>
        </div>
    );
};

export default SplashScreen;
