import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// --- COMPONENTES DEL TABLERO ---
import GameBoard from './components/GameBoard';
import PauseMenu from './components/PauseMenu';

// --- MINIJUEGOS ---
import AxolotlRaceMinigame from './components/AxolotlRaceMinigame';
import TimeBombMinigame from './components/TimeBombMinigame';
import BlindSniperMinigame from './components/BlindSniperMinigame';
import FingerRouletteMinigame from './components/FingerRouletteMinigame';
import PongtePedoMinigame from './components/PongtePedoMinigame';
import HighLowCardMinigame from './components/HighLowCardMinigame';
import ToxicSequenceMinigame from './components/ToxicSequenceMinigame';

/**
 * Componente Principal de la Sesión de Juego Activa.
 * 
 * Actúa como el controlador maestro del estado del juego en curso.
 * Maneja las fases del juego (Tirar dados, Minijuego, etc.),
 * controla a los jugadores, y coordina la renderización dinámica
 * de los minijuegos mediante condicionales.
 */
const ActiveGameSession = () => {
    const navigate = useNavigate();

    // --- ESTADOS DEL JUEGO ---
    const [gameState, setGameState] = useState({
        players: [],
        currentPlayerIdx: 0,
        gamePhase: 'SETUP', // Fases: SETUP, ROLL, MOVE, CHALLENGE, MINIGAME, WIN
        currentMinigame: null,
        winner: null
    });

    const [isPaused, setIsPaused] = useState(false);

    /**
     * Efecto inicial: Carga los jugadores al iniciar la sesión.
     * Actualmente inicializa con datos estáticos simulados.
     */
    useEffect(() => {
        // TODO: Cargar los jugadores reales desde el contexto global o almacenamiento persistente
        const loadedPlayers = [
            { id: 1, name: 'Jugador 1', position: 0, color: 'red' },
            { id: 2, name: 'Jugador 2', position: 0, color: 'blue' }
        ];

        setGameState(prev => ({
            ...prev,
            players: loadedPlayers,
            gamePhase: 'ROLL' // Iniciamos directo en tirar dados para pruebas
        }));
    }, []);

    /**
     * Manejador que se ejecuta cuando un minijuego termina.
     * Recibe los resultados (quién ganó/perdió), aplica consecuencias
     * y devuelve el control al tablero principal.
     * 
     * @param {Object} results - Resultados obtenidos del minijuego.
     */
    const handleMinigameEnd = (results) => {
        // TODO: Lógica para aplicar castigos/premios según el resultado
        console.log('Minigame ended:', results);

        // Regresar al tablero
        setGameState(prev => ({
            ...prev,
            gamePhase: 'ROLL', // Siguiente turno
            currentMinigame: null,
            currentPlayerIdx: (prev.currentPlayerIdx + 1) % prev.players.length
        }));
    };

    /**
     * Función de utilidad (temporal/debug) para disparar manualmente un minijuego.
     * 
     * @param {string} gameId - Identificador del minijuego (ej. 'sequence', 'race').
     */
    const triggerMinigame = (gameId) => {
        setGameState(prev => ({
            ...prev,
            gamePhase: 'MINIGAME',
            currentMinigame: gameId
        }));
    };

    /**
     * Renderiza dinámicamente el minijuego actual basado en el estado `currentMinigame`.
     * Inyecta propiedades comunes como `onClose` y la lista de jugadores.
     */
    const renderMinigame = () => {
        const { currentMinigame } = gameState;

        // Propiedades comunes pasadas a la mayoría de minijuegos
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
            case 'pong':
                return <PongtePedoMinigame {...commonProps} />;
            case 'cards':
                return <HighLowCardMinigame onClose={handleMinigameEnd} />;
            case 'sequence':
                return <ToxicSequenceMinigame onClose={handleMinigameEnd} />;
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

            {/* DEBUG: Botones para probar (se eliminarán en producción) */}
            {gameState.gamePhase === 'ROLL' && (
                <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-2">
                    <button onClick={() => triggerMinigame('sequence')} className="bg-yellow-600 text-white p-2 rounded">
                        Test Secuencia
                    </button>
                </div>
            )}
        </div>
    );
};

export default ActiveGameSession;