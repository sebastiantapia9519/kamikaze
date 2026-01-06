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
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>

            {/* --- SEO y Metadatos de la Página --- */}
            {/* Este bloque usa React Helmet para inyectar etiquetas en el <head> del HTML. */}
            {/* Es crucial para el posicionamiento en buscadores (SEO) y no es visible en la página. */}
            <Helmet>
                <title>Acerca de - Kamikaze Drinking Game</title>
                <meta name="description" content="Descubre todo sobre Kamikaze, el juego de beber más emocionante. Aprende las reglas, propón nuevos retos y únete a nuestra comunidad." />
                <meta name="keywords" content="kamikaze, juego de beber, retos, fiesta, amigos, PWA, drinking game" />
            </Helmet>

            {/* Renderiza el encabezado principal de la aplicación (la barra de navegación superior). */}
            <Header />

            {/* Contenedor del contenido principal de la página. */}
            <main className="pb-24 px-4 sm:px-6 lg:px-8 pt-2.5 relative z-10">
                <div className="max-w-4xl mx-auto">

                    {/* Componente para la navegación de regreso. Muestra un enlace para "Volver al Inicio". */}
                    <ContextualBackNavigation
                        customBackPath="/home-dashboard"
                        customLabel="Volver al Inicio"
                        showBreadcrumb={true}
                        className="mb-8" />

                    {/* --- Encabezado Visual de la Página --- */}
                    <div className="text-center mb-12">
                        {/* Círculo con el ícono de Información, con un degradado y una animación de pulso. */}
                        <div className="w-20 h-20 bg-gradient-to-br from-primary via-accent to-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-graffiti-lg animate-pulse-glow">
                            <Icon name="Info" size={36} className="text-white" />
                        </div>
                        {/* Título principal de la página con un efecto de texto degradado. */}
                        <h1 className="font-heading text-4xl md:text-5xl text-transparent bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text mb-4">
                            Acerca de Kamikaze
                        </h1>
                        {/* Subtítulo o eslogan de la página. */}
                        <p className="font-body text-lg text-text-secondary max-w-2xl mx-auto">
                            El juego de beber definitivo que transformará tus reuniones en experiencias épicas e inolvidables
                        </p>
                    </div>

                    {/* --- Secciones de Contenido Informativo --- */}
                    {/* Este contenedor agrupa todas las secciones principales de la página. */}
                    <div className="space-y-8">
                        <GameDescriptionSection />      {/* Sección que explica qué es el juego. */}
                        <GameFeaturesGrid />            {/* Sección que muestra las características principales. */}
                        <ChallengeProposalSection />    {/* Sección que invita a los usuarios a proponer retos. */}
                        <ResponsibleDrinkingReminder /> {/* Recordatorio sobre el consumo responsable de alcohol. */}
                        <InstallationGuideSection />    {/* Guía para instalar la app (PWA). */}
                        <CommunityGuidelinesSection />  {/* Reglas de la comunidad. */}
                    </div>

                    {/* --- Información de Pie de Página y Créditos --- */}
                    <div className="mt-12 text-center">
                        <div className="bg-surface/30 p-6 rounded-lg border border-border">
                            <div className="flex items-center justify-center space-x-2 mb-3">
                                <Icon name="Calendar" size={18} className="text-text-secondary" />
                                <span className="font-body text-text-secondary">
                                    {/* Obtiene el año actual dinámicamente para mantener la fecha actualizada sin editar el código. */}
                                    Última actualización: Octubre {new Date()?.getFullYear()}
                                </span>
                            </div>
                            {/* Párrafo de créditos y contexto del proyecto. */}
                            <p className="font-body text-sm text-text-secondary">
                                Kamikaze es un proyecto de escrito con el corazón y código, inspirado en noches con caguamas y jueguitos para empedarnos.
                                <br />
                                Dev. Sebastian Tapia
                            </p>
                            {/* Pequeños íconos con puntos clave sobre el proyecto. */}
                            <div className="flex items-center justify-center space-x-6 mt-4 text-sm text-text-secondary">
                                <div className="flex items-center space-x-1">
                                    <Icon name="Users" size={14} />
                                    <span>Comunidad Global</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Icon name="Zap" size={14} />
                                    <span>PWA Nativo</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Icon name="Shield" size={14} />
                                    <span>Juego Responsable</span>
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