import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import ContextualBackNavigation from '../../components/ui/ContextualBackNavigation';
import PlayerSetupHeader from './components/PlayerSetupHeader';
import PlayerInputForm from './components/PlayerInputForm';
import PlayerList from './components/PlayerList';
import GameStartButton from './components/GameStartButton';
import bgImage from '../../assets/images/graffiti-bg.png';

/**
 * Página de Configuración de Jugadores.
 * Permite añadir, listar y eliminar a los jugadores que participarán en la sesión.
 * Mantiene sincronizado el estado con localStorage para persistencia entre recargas.
 */
const PlayerSetup = () => {
    const [players, setPlayers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Cargar jugadores existentes desde localStorage al inicializar el componente.
     */
    useEffect(() => {
        const savedPlayers = localStorage.getItem('kamikazeGamePlayers');
        if (savedPlayers) {
            try {
                const parsedPlayers = JSON.parse(savedPlayers);
                if (Array.isArray(parsedPlayers)) {
                    setPlayers(parsedPlayers);
                }
            } catch (error) {
                console.error('Error loading saved players:', error);
                localStorage.removeItem('kamikazeGamePlayers');
            }
        }
    }, []);

    /**
     * Sincronizar el estado actual de jugadores con localStorage cada vez que cambia.
     */
    useEffect(() => {
        if (players?.length > 0) {
            localStorage.setItem('kamikazeGamePlayers', JSON.stringify(players));
        } else {
            localStorage.removeItem('kamikazeGamePlayers');
        }
    }, [players]);

    /**
     * Genera un identificador único para un nuevo jugador basado en el tiempo y un hash aleatorio.
     * @returns {string} El ID generado.
     */
    const generatePlayerId = () => {
        return `player_${Date.now()}_${Math.random()?.toString(36)?.substr(2, 9)}`;
    };

    /**
     * Añade un nuevo jugador a la lista actual.
     * Muestra un pequeño retardo simulado para dar feedback visual al usuario.
     * 
     * @param {string} playerName - El nombre del nuevo jugador.
     */
    const handleAddPlayer = (playerName) => {
        if (!playerName?.trim()) return;

        setIsLoading(true);

        // Simular una carga breve para mejorar la experiencia de usuario (UX)
        setTimeout(() => {
            const newPlayer = {
                id: generatePlayerId(),
                name: playerName?.trim(),
                addedAt: new Date()?.toISOString()
            };

            setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
            setIsLoading(false);
        }, 200);
    };

    /**
     * Elimina un jugador específico de la lista.
     * 
     * @param {string} playerId - El ID del jugador a eliminar.
     */
    const handleRemovePlayer = (playerId) => {
        setPlayers((prevPlayers) =>
            prevPlayers?.filter((player) => player?.id !== playerId)
        );
    };

    /**
     * Limpia completamente la lista de jugadores y el localStorage asociado.
     */
    const handleClearAllPlayers = () => {
        setPlayers([]);
        localStorage.removeItem('kamikazeGamePlayers');
    };

    return (
        <>
            <Helmet>
                <title>Configurar Jugadores - Kamikaze!</title>
                <meta name="description" content="Agrega jugadores y configura tu grupo para comenzar el juego Kamikaze. Mínimo 2 jugadores requeridos." />
            </Helmet>
            <div className="min-h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden" style={{ backgroundImage: `url(${bgImage})` }}>

                {/* Capa de oscurecimiento del fondo para legibilidad */}
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>

                <main className="relative z-10 pb-24 pt-2.5">
                    <div className="container mx-auto px-4 py-8 max-w-2xl pt-0">
                        <ContextualBackNavigation
                            customBackPath="/home-dashboard"
                            customLabel="Volver al Inicio"
                            showBreadcrumb={true}
                            className="mb-6" />


                        {/* Header de la sección */}
                        <PlayerSetupHeader playerCount={players?.length} />

                        {/* Contenido principal */}
                        <div className="space-y-6">
                            {/* Formulario de entrada de jugador */}
                            <PlayerInputForm
                                onAddPlayer={handleAddPlayer}
                                existingPlayers={players} />


                            {/* Lista de jugadores agregados */}
                            <PlayerList
                                players={players}
                                onRemovePlayer={handleRemovePlayer} />


                            {/* Botón para limpiar todos (solo visible si hay jugadores) */}
                            {players?.length > 0 &&
                                <div className="text-center">
                                    <button
                                        onClick={handleClearAllPlayers}
                                        className="text-sm text-error hover:text-error/80 underline transition-colors">
                                        Limpiar todos los jugadores
                                    </button>
                                </div>
                            }

                            {/* Botón de Iniciar Juego */}
                            <GameStartButton
                                players={players}
                                disabled={isLoading} />

                        </div>

                        {/* Sección de consejos rápidos */}
                        <div className="mt-12 p-6 bg-card/50 backdrop-blur-sm rounded-lg border border-border">
                            <h3 className="font-heading text-lg text-text-primary mb-3 text-center">
                                💡 Consejos para una mejor experiencia
                            </h3>
                            <div className="space-y-2 text-sm text-text-secondary">
                                <p className="text-[rgba(237,235,255,1)]">• <strong>2-4 jugadores:</strong> Perfecto para grupos íntimos</p>
                                <p className="text-[rgba(230,233,254,1)]">• <strong>5-6 jugadores:</strong> Ideal para fiestas medianas</p>
                                <p className="text-[rgba(228,225,254,1)]">• <strong>7-12 jugadores:</strong> Para armar un pedon</p>
                                <p className="text-[rgba(235,235,254,1)]">• <strong>Nombres únicos:</strong> Evita confusiones durante el juego</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default PlayerSetup;