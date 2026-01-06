import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";

// Componentes UI (Asegúrate de que estos archivos existan en estas rutas)
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";

// Página 404
import NotFound from "./pages/NotFound";

// Páginas Principales
import HomeDashboard from './pages/home-dashboard';
import ActiveGameSession from './pages/active-game-session';
import GameConfiguration from './pages/game-configuration';
import AboutInformation from './pages/about-information';
import AgeVerificationDisclaimer from './pages/age-verification-disclaimer';
import PlayerSetup from './pages/player-setup';

const Routes = () => {
    return (
        <BrowserRouter>
            <ErrorBoundary>
                <ScrollToTop />
                <RouterRoutes>
                    {/* Configuramos el flujo correcto: Primero Disclaimer -> Luego Home */}

                    {/* Ruta Raíz: Abre Verificación de Edad primero */}
                    <Route path="/" element={<AgeVerificationDisclaimer />} />

                    <Route path="/home-dashboard" element={<HomeDashboard />} />
                    <Route path="/active-game-session" element={<ActiveGameSession />} />
                    <Route path="/game-configuration" element={<GameConfiguration />} />
                    <Route path="/about-information" element={<AboutInformation />} />
                    <Route path="/player-setup" element={<PlayerSetup />} />

                    {/* Ruta extra por si acaso */}
                    <Route path="/age-verification-disclaimer" element={<AgeVerificationDisclaimer />} />

                    {/* Ruta para error 404 */}
                    <Route path="*" element={<NotFound />} />
                </RouterRoutes>
            </ErrorBoundary>
        </BrowserRouter>
    );
};

export default Routes;