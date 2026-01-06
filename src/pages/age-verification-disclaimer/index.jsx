import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DisclaimerCard from './components/DisclaimerCard';
import ResponsibleDrinkingIcons from './components/ResponsibleDrinkingIcons';
import LegalWarningBanner from './components/LegalWarningBanner';

const AgeVerificationDisclaimer = () => {
    const navigate = useNavigate();
    const [isAccepting, setIsAccepting] = useState(false);

    // Check if user has already accepted disclaimer
    useEffect(() => {
        const hasAccepted = localStorage.getItem('kamikazeDisclaimerAccepted');
        if (hasAccepted === 'true') {
            navigate('/home-dashboard');
        }
    }, [navigate]);

    const handleAccept = () => {
        setIsAccepting(true);

        // Store acceptance in localStorage
        localStorage.setItem('kamikazeDisclaimerAccepted', 'true');
        localStorage.setItem('kamikazeDisclaimerDate', new Date()?.toISOString());

        // Add slight delay for better UX
        setTimeout(() => {
            navigate('/home-dashboard');
        }, 1000);
    };

    const handleReject = () => {
        // Clear any stored data and redirect away
        localStorage.removeItem('kamikazeDisclaimerAccepted');
        localStorage.removeItem('kamikazeDisclaimerDate');

        // Redirect to a safe page or show rejection message
        window.location.href = 'https://www.google.com';
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Graffiti Brick Wall Background */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop&crop=center')`
                }}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95" />
            {/* Legal Warning Banner */}
            <LegalWarningBanner />
            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4 pt-16">
                <div className="w-full max-w-lg space-y-6">
                    {/* Responsible Drinking Icons */}
                    <div className="mb-8">
                        <ResponsibleDrinkingIcons />
                    </div>

                    {/* Main Disclaimer Card */}
                    <DisclaimerCard
                        onAccept={handleAccept}
                        onReject={handleReject}
                    />

                    {/* Additional Legal Notice */}
                    <div className="text-center space-y-2">
                        <p className="text-xs text-text-secondary">
                            Esta aplicación es solo para entretenimiento
                        </p>
                        <p className="text-xs text-text-secondary">
                            © {new Date()?.getFullYear()} Kamikaze Game. Todos los derechos reservados.
                        </p>
                    </div>

                    {/* Loading State */}
                    {isAccepting && (
                        <div className="fixed inset-0 z-400 bg-background/80 backdrop-blur-sm flex items-center justify-center">
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
            {/* Bottom Safety Reminder */}
            <div className="fixed bottom-0 left-0 right-0 z-100 bg-surface/90 backdrop-blur-sm border-t border-border p-3">
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