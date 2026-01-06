import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeHero from './components/WelcomeHero';
import MainNavigationButtons from './components/MainNavigationButtons';
import GameStatsPreview from './components/GameStatsPreview';
import PartyAtmosphere from './components/PartyAtmosphere';
import ResponsibilityReminder from './components/ResponsibilityReminder';

// ✅ IMPORTANTE: Aquí importas la imagen
import bgImage from '../../assets/images/graffiti-bg.png';

const HomeDashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user has accepted disclaimer
        const disclaimerAccepted = localStorage.getItem('kamikazeDisclaimerAccepted');
        if (!disclaimerAccepted) {
            navigate('/age-verification-disclaimer');
            return;
        }

        // Set page title
        document.title = 'Kamikaze! - Juego de Beber';
    }, [navigate]);

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden"
            style={{
                // ✅ CAMBIO CLAVE: Usamos la variable 'bgImage' que importaste arriba
                backgroundImage: `url(${bgImage})`
            }}
        >
            {/* ✅ MAGIA VISUAL: Esta capa oscura y borrosa hace que el texto se lea perfecto */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>

            {/* Party atmosphere background elements */}
            <PartyAtmosphere />

            {/* Main content */}
            <div className="relative z-10 min-h-screen flex flex-col">

                {/* Main content area */}
                <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
                    <div className="max-w-2xl mx-auto">
                        {/* Welcome section */}
                        <WelcomeHero />

                        {/* Navigation buttons */}
                        <MainNavigationButtons />

                        {/* Game information */}
                        <GameStatsPreview />
                    </div>
                </main>

                {/* Footer spacing */}
                <div className="h-20"></div>
            </div>

            {/* Responsibility reminder */}
            <ResponsibilityReminder />
        </div>
    );
};

export default HomeDashboard;