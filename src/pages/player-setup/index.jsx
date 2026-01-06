import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import ContextualBackNavigation from '../../components/ui/ContextualBackNavigation';
import PlayerSetupHeader from './components/PlayerSetupHeader';
import PlayerInputForm from './components/PlayerInputForm';
import PlayerList from './components/PlayerList';
import GameStartButton from './components/GameStartButton';
import bgImage from '../../assets/images/graffiti-bg.png';

const PlayerSetup = () => {
    const [players, setPlayers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Load existing players from localStorage on mount
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

    // Save players to localStorage whenever players change
    useEffect(() => {
        if (players?.length > 0) {
            localStorage.setItem('kamikazeGamePlayers', JSON.stringify(players));
        } else {
            localStorage.removeItem('kamikazeGamePlayers');
        }
    }, [players]);

    const generatePlayerId = () => {
        return `player_${Date.now()}_${Math.random()?.toString(36)?.substr(2, 9)}`;
    };

    const handleAddPlayer = (playerName) => {
        if (!playerName?.trim()) return;

        setIsLoading(true);

        // Simulate a brief loading state for better UX
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

    const handleRemovePlayer = (playerId) => {
        setPlayers((prevPlayers) =>
            prevPlayers?.filter((player) => player?.id !== playerId)
        );
    };

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

                {/* Background overlay for readability */}
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>

                <main className="relative z-10 pb-24 pt-2.5">
                    <div className="container mx-auto px-4 py-8 max-w-2xl pt-0">
                        <ContextualBackNavigation
                            customBackPath="/home-dashboard"
                            customLabel="Volver al Inicio"
                            showBreadcrumb={true}
                            className="mb-6" />


                        {/* Header Section */}
                        <PlayerSetupHeader playerCount={players?.length} />

                        {/* Main Content */}
                        <div className="space-y-6">
                            {/* Player Input Form */}
                            <PlayerInputForm
                                onAddPlayer={handleAddPlayer}
                                existingPlayers={players} />


                            {/* Player List */}
                            <PlayerList
                                players={players}
                                onRemovePlayer={handleRemovePlayer} />


                            {/* Clear All Button (only show if players exist) */}
                            {players?.length > 0 &&
                                <div className="text-center">
                                    <button
                                        onClick={handleClearAllPlayers}
                                        className="text-sm text-error hover:text-error/80 underline transition-colors">

                                        Limpiar todos los jugadores
                                    </button>
                                </div>
                            }

                            {/* Game Start Button */}
                            <GameStartButton
                                players={players}
                                disabled={isLoading} />

                        </div>

                        {/* Tips Section */}
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