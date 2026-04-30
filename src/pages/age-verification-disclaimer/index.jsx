import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DisclaimerCard from './components/DisclaimerCard';
import ResponsibleDrinkingIcons from './components/ResponsibleDrinkingIcons';
import LegalWarningBanner from './components/LegalWarningBanner';
import bgImage from '../../assets/images/graffiti-bg.png';

/**
 * Componente principal para la página de verificación de edad y descargo de responsabilidad.
 * Obliga al usuario a aceptar los términos antes de permitir el acceso al menú principal (`HomeDashboard`).
 * Almacena el consentimiento en `localStorage`.
 */
const AgeVerificationDisclaimer = () => {
    const navigate = useNavigate();
    const [isAccepting, setIsAccepting] = useState(false);

    /**
     * Comprueba si el usuario ya ha aceptado el descargo de responsabilidad previamente.
     * Si es así, redirige automáticamente al Home Dashboard.
     */
    useEffect(() => {
        const hasAccepted = localStorage.getItem('kamikazeDisclaimerAccepted');
        if (hasAccepted === 'true') {
            navigate('/home-dashboard');
        }
    }, [navigate]);

    /**
     * Maneja la aceptación de los términos.
     * Guarda la confirmación en el estado local y redirige al menú principal.
     */
    const handleAccept = () => {
        setIsAccepting(true);

        // Almacenar aceptación en localStorage
        localStorage.setItem('kamikazeDisclaimerAccepted', 'true');
        localStorage.setItem('kamikazeDisclaimerDate', new Date()?.toISOString());

        // Pequeño retraso para mejorar la experiencia de usuario (Feedback visual)
        setTimeout(() => {
            navigate('/home-dashboard');
        }, 1000);
    };

    /**
     * Maneja el rechazo de los términos.
     * Limpia los datos guardados y redirige al usuario a una página segura externa.
     */
    const handleReject = () => {
        // Limpiar cualquier dato almacenado
        localStorage.removeItem('kamikazeDisclaimerAccepted');
        localStorage.removeItem('kamikazeDisclaimerDate');

        // Redirigir a una página segura
        window.location.href = 'https://www.google.com';
    };

    return (
        <div className="min-h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden" style={{ backgroundImage: `url(${bgImage})` }}>
            {/* Capa oscura superpuesta al fondo */}
            <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
            
            {/* Banner de advertencia legal superior */}
            <LegalWarningBanner />
            
            {/* Contenido Principal */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4 pt-16">
                <div className="w-full max-w-lg space-y-6">
                    {/* Iconos de Consumo Responsable */}
                    <div className="mb-8">
                        <ResponsibleDrinkingIcons />
                    </div>

                    {/* Tarjeta Principal del Disclaimer */}
                    <DisclaimerCard
                        onAccept={handleAccept}
                        onReject={handleReject}
                    />

                    {/* Nota Legal Adicional */}
                    <div className="text-center space-y-2">
                        <p className="text-xs text-text-secondary">
                            Esta aplicación es solo para entretenimiento
                        </p>
                        <p className="text-xs text-text-secondary">
                            © {new Date()?.getFullYear()} Kamikaze Game. Todos los derechos reservados.
                        </p>
                    </div>

                    {/* Estado de Carga (Al aceptar) */}
                    {isAccepting && (
                        <div className="fixed inset-0 z-[400] bg-background/80 backdrop-blur-sm flex items-center justify-center">
                            <div className="bg-card p-8 rounded-lg shadow-graffiti-lg text-center">
                                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                <p className="text-text-primary font-medium">
                                    Preparando el juego...
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Recordatorio Inferior de Seguridad */}
            <div className="fixed bottom-0 left-0 right-0 z-[100] bg-surface/90 backdrop-blur-sm border-t border-border p-3">
                <div className="text-center">
                    <p className="text-xs text-text-secondary">
                        🚨 Recuerda: Siempre bebe responsablemente y nunca conduzcas bajo la influencia del alcohol
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AgeVerificationDisclaimer;