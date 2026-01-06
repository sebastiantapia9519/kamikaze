/**
 * @file src/pages/about-information/index.jsx
 * @description Componente que renderiza la página estática "Acerca de" de la aplicación Kamikaze.
 * Esta página proporciona información detallada sobre el juego, sus características y la comunidad.
 */

import React from 'react';
import { Helmet } from 'react-helmet'; // Importa Helmet para gestionar el <head> del HTML (SEO y título de la página).

// --- Importación de Componentes Reutilizables ---
// Cada uno de estos componentes representa una sección visual específica dentro de esta página.
import Header from '../../components/ui/Header';
import ContextualBackNavigation from '../../components/ui/ContextualBackNavigation';
import GameDescriptionSection from './components/GameDescriptionSection';
import GameFeaturesGrid from './components/GameFeaturesGrid';
import ChallengeProposalSection from './components/ChallengeProposalSection';
import ResponsibleDrinkingReminder from './components/ResponsibleDrinkingReminder';
import InstallationGuideSection from './components/InstallationGuideSection';
import CommunityGuidelinesSection from './components/CommunityGuidelinesSection';
import Icon from '../../components/AppIcon'; // El componente reutilizable para mostrar íconos.
import bgImage from '../../assets/images/graffiti-bg.png';

/**
 * Componente principal de la página "Acerca de".
 * Es un componente "presentacional", es decir, no maneja lógica compleja ni estado.
 * Su única función es estructurar y mostrar la información usando otros componentes.
 */
const AboutInformation = () => {
    return (
        // Contenedor principal de la página con un color de fondo definido en el tema.
        <div className="min-h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden" style={{ backgroundImage: `url(${bgImage})` }}>
            {/* Capa oscura para que el texto resalte sobre el graffiti */}
            <div className="absolute inset-0 bg-gray-950/90 backdrop-blur-sm"></div>

            {/* --- SEO y Metadatos de la Página --- */}
            <Helmet>
                <title>Acerca de - Kamikaze Drinking Game</title>
                <meta name="description" content="Descubre todo sobre Kamikaze, el juego de beber más emocionante. Aprende las reglas, propón nuevos retos y únete a nuestra comunidad." />
                <meta name="keywords" content="kamikaze, juego de beber, retos, fiesta, amigos, PWA, drinking game" />
            </Helmet>

            {/* Renderiza el encabezado principal de la aplicación */}
            <Header />

            {/* Contenedor del contenido principal de la página. */}
            <main className="pb-24 px-4 sm:px-6 lg:px-8 pt-2.5 relative z-10">
                <div className="max-w-4xl mx-auto">

                    {/* Componente para la navegación de regreso. */}
                    <ContextualBackNavigation
                        customBackPath="/home-dashboard"
                        customLabel="Volver al Inicio"
                        showBreadcrumb={true}
                        className="mb-8" />

                    {/* --- Encabezado Visual de la Página --- */}
                    <div className="text-center mb-12">
                        {/* Círculo con el ícono de Información */}
                        <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/20 animate-pulse">
                            <Icon name="Info" size={36} className="text-white" />
                        </div>
                        {/* Título principal */}
                        <h1 className="font-heading text-4xl md:text-5xl text-white mb-4 drop-shadow-lg">
                            Acerca de Kamikaze
                        </h1>
                        {/* Subtítulo */}
                        <p className="font-body text-lg text-gray-400 max-w-2xl mx-auto">
                            El juego de beber definitivo que transformará tus reuniones en experiencias épicas e inolvidables.
                        </p>
                    </div>

                    {/* --- Secciones de Contenido Informativo --- */}
                    <div className="space-y-8">
                        <GameDescriptionSection />      {/* Qué es el juego */}
                        <GameFeaturesGrid />            {/* Características */}
                        <ChallengeProposalSection />    {/* Proponer retos */}
                        <ResponsibleDrinkingReminder /> {/* Consumo responsable */}
                        <InstallationGuideSection />    {/* Guía PWA */}
                        <CommunityGuidelinesSection />  {/* Reglas comunidad */}
                    </div>

                    {/* --- Información de Pie de Página y Créditos (ACTUALIZADO AL MODO OSCURO) --- */}
                    <div className="mt-12 text-center">
                        <div className="bg-gray-900 p-8 rounded-2xl border border-white/10 shadow-xl relative overflow-hidden">

                            {/* Decoración sutil */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

                            <div className="relative z-10">
                                <div className="flex items-center justify-center space-x-2 mb-3">
                                    <Icon name="Calendar" size={18} className="text-purple-400" />
                                    <span className="font-body text-gray-400 text-sm">
                                        Última actualización: Enero {new Date()?.getFullYear()}
                                    </span>
                                </div>

                                {/* Créditos */}
                                <p className="font-body text-sm text-gray-300 leading-relaxed max-w-lg mx-auto">
                                    Kamikaze es un proyecto escrito con el corazón y código, inspirado en noches con caguamas y jueguitos para empedarnos.
                                    <br />
                                    <span className="text-white font-bold mt-2 block">Dev. Sebastian Tapia</span>
                                </p>

                                {/* Iconos finales */}
                                <div className="flex items-center justify-center space-x-6 mt-6 text-xs text-gray-500 uppercase tracking-widest font-bold">
                                    <div className="flex items-center space-x-1">
                                        <Icon name="Users" size={12} />
                                        <span>Comunidad</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Icon name="Zap" size={12} />
                                        <span>PWA</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Icon name="Shield" size={12} />
                                        <span>Seguridad</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AboutInformation;