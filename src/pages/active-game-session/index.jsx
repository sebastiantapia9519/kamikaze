import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// --- COMPONENTES DEL TABLERO ---
import GameBoard from './components/GameBoard';
import GameControls from './components/GameControls';
import PlayerTurnOverlay from './components/PlayerTurnOverlay';
import ChallengeCardModal from './components/ChallengeCardModal';
import WinnerModal from './components/WinnerModal';
import PauseMenu from './components/PauseMenu';

// --- MINIJUEGOS (Aquí es donde limpiamos) ---
import AxolotlRaceMinigame from './components/AxolotlRaceMinigame';
import TimeBombMinigame from './components/TimeBombMinigame';
import BlindSniperMinigame from './components/BlindSniperMinigame';
import FingerRouletteMinigame from './components/FingerRouletteMinigame';
import TapBattleMinigame from './components/TapBattleMinigame';
import HighLowCardMinigame from './components/HighLowCardMinigame';
import ToxicSequenceMinigame from './components/ToxicSequenceMinigame'; // ✅ Se queda

// ❌ SEMÁFORO ELIMINADO

const ActiveGameSession = () => {
    const navigate = useNavigate();

    // --- ESTADOS DEL JUEGO ---
    const [gameState, setGameState] = useState({
        players: [],
        currentPlayerIdx: 0,
        gamePhase: 'SETUP', // SETUP, ROLL, MOVE, CHALLENGE, MINIGAME, WIN
        currentMinigame: null,
        winner: null
    });

    const [isPaused, setIsPaused] = useState(false);

    // Cargar jugadores al inicio (simulado o desde contexto)
    useEffect(() => {
        // Aquí deberías cargar los jugadores reales desde el setup anterior
        // Por ahora simulamos si no hay datos
        const loadedPlayers = [
            { id: 1, name: 'Jugador 1', position: 0, color: 'red' },
            { id: 2, name: 'Jugador 2', position: 0, color: 'blue' }
        ];

        setGameState(prev => ({
            ...prev,
            players: loadedPlayers,
            gamePhase: 'ROLL' // Iniciamos directo en tirar dados
        }));
    }, []);

    // --- MANEJO DE MINIJUEGOS ---
    const handleMinigameEnd = (results) => {
        // Lógica para aplicar castigos/premios según el resultado
        console.log('Minigame ended:', results);

        // Regresar al tablero
        setGameState(prev => ({
            ...prev,
            gamePhase: 'ROLL', // Siguiente turno
            currentMinigame: null,
            currentPlayerIdx: (prev.currentPlayerIdx + 1) % prev.players.length
        }));
    };

    const triggerMinigame = (gameId) => {
        setGameState(prev => ({
            ...prev,
            gamePhase: 'MINIGAME',
            currentMinigame: gameId
        }));
    };

    // --- RENDERIZADO DE MINIJUEGOS ---
    const renderMinigame = () => {
        const { currentMinigame } = gameState;

        // Pasamos onClose para que el minijuego sepa volver al tablero
        const commonProps = {
            onClose: handleMinigameEnd,
            players: gameState.players
        };

        switch (currentMinigame) {
            case 'race':
                return <AxolotlRaceMinigame {...commonProps} />;
            case 'bomb':
                return <TimeBombMinigame currentPlayer={gameState.players[gameState.currentPlayerIdx]} onClose={handleMinigameEnd} />;
            case 'sniper':
                return <BlindSniperMinigame currentPlayer={gameState.players[gameState.currentPlayerIdx]} onClose={handleMinigameEnd} />;
            case 'roulette':
                return <FingerRouletteMinigame onClose={handleMinigameEnd} />;
            case 'battle':
                return <TapBattleMinigame {...commonProps} />;
            case 'cards':
                return <HighLowCardMinigame onClose={handleMinigameEnd} />;
            case 'sequence':
                return <ToxicSequenceMinigame onClose={handleMinigameEnd} />;

            // ELIMINADO: case 'traffic': return <DrunkenTrafficLightMinigame ... />

            default:
                return null;
        }
    };

    return (
        <div className="relative min-h-screen bg-gray-900 overflow-hidden">

            {/* TABLERO DE FONDO */}
            <GameBoard players={gameState.players} />

            {/* UI SUPERIOR */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-none">
                <div className="pointer-events-auto">
                    <button
                        onClick={() => setIsPaused(true)}
                        className="bg-gray-800/80 p-3 rounded-full text-white hover:bg-gray-700 backdrop-blur-sm"
                    >
                        ⏸️
                    </button>
                </div>
            </div>

            {/* CAPA DE MINIJUEGOS */}
            <AnimatePresence>
                {gameState.gamePhase === 'MINIGAME' && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
                        {renderMinigame()}
                    </div>
                )}
            </AnimatePresence>

            {/* MENÚ DE PAUSA */}
            {isPaused && (
                <PauseMenu
                    onResume={() => setIsPaused(false)}
                    onQuit={() => navigate('/')}
                />
            )}

            {/* DEBUG: Botones para probar (puedes borrarlos luego) */}
            {gameState.gamePhase === 'ROLL' && (
                <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-2">
                    <button onClick={() => triggerMinigame('sequence')} className="bg-yellow-600 text-white p-2 rounded">
                        Test Secuencia
                    </button>
                    {/* Botón de semáforo eliminado */}
                </div>
            )}
        </div>
    );
};

export default ActiveGameSession;