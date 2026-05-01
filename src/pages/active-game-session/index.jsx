import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// --- IMÁGENES ---
import bgImage from '../../assets/images/graffiti-bg.png';

// --- COMPONENTES DEL JUEGO ---
import PauseMenu from './components/PauseMenu';
import ChallengeCard from './components/ChallengeCard';
import GameControls from './components/GameControls';
import { sampleChallenges } from './data/challenges';

// --- MINIJUEGOS ---
import AxolotlRaceMinigame from './components/AxolotlRaceMinigame';
import TimeBombMinigame from './components/TimeBombMinigame';
import BlindSniperMinigame from './components/BlindSniperMinigame';
import FingerRouletteMinigame from './components/FingerRouletteMinigame';
import PongtePedoMinigame from './components/PongtePedoMinigame';
import HighLowCardMinigame from './components/HighLowCardMinigame';
import ToxicSequenceMinigame from './components/ToxicSequenceMinigame';

const MINIGAMES = ['race', 'bomb', 'sniper', 'roulette', 'pong', 'cards', 'sequence'];

const MINIGAME_INFO = {
    'race': { title: 'Carrera de Ajolotes', desc: '¡Todos eligen un ajolote y rezan por su vida!', type: 'group' },
    'bomb': { title: 'Papa Caliente', desc: 'Pásense el celular antes de que explote la bomba.', type: 'group' },
    'sniper': { title: 'Francotirador Ciego', desc: 'Pon a prueba tus reflejos y precisión.', type: 'solo' },
    'roulette': { title: 'Ruleta de Dedos', desc: 'Todos pongan un dedo en la pantalla.', type: 'group' },
    'pong': { title: 'Pongte Pedo', desc: 'El clásico pong pero con castigos.', type: 'vs' },
    'cards': { title: 'Cartas del Destino', desc: 'Adivina si la siguiente carta es mayor o menor.', type: 'solo' },
    'sequence': { title: 'Secuencia Tóxica', desc: 'Memoriza el patrón, si fallas bebes.', type: 'solo' }
};

const ActiveGameSession = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // --- ESTADOS DE CONFIGURACIÓN GLOBAL ---
    const [categories, setCategories] = useState({ regular: true, epic: true, multiplayer: true });
    const [gameplaySettings, setGameplaySettings] = useState({
        difficulty: 'medium',
        turnOrder: 'random',
        enableVibration: true,
        enableSounds: true
    });

    // --- ESTADOS DEL JUEGO ---
    const [gameState, setGameState] = useState({
        players: [],
        currentPlayerIdx: 0,
        gamePhase: 'ROLL', // ROLL, CHALLENGE, MINIGAME_INTRO, MINIGAME, GAME_OVER
        currentMinigame: null,
        currentChallengeData: null,
        challengesDrawn: 0,
        totalChallenges: 30
    });

    const [isPaused, setIsPaused] = useState(false);

    // Helpers
    const getMinigameChance = (difficulty) => {
        if (difficulty === 'hard') return 0.35;
        if (difficulty === 'easy') return 0.10;
        return 0.20; // medium
    };

    const getRandomChallenge = (activeCategories) => {
        // Mapeo: regular -> Normal, epic -> Epic, multiplayer -> Fiesta
        const allowedCategories = [];
        if (activeCategories.regular) allowedCategories.push('Normal');
        if (activeCategories.epic) allowedCategories.push('Epic');
        if (activeCategories.multiplayer) allowedCategories.push('Fiesta');

        // Fallback si desactivó todas
        if (allowedCategories.length === 0) allowedCategories.push('Normal');

        const filtered = sampleChallenges.filter(ch => allowedCategories.includes(ch.category));
        if (filtered.length === 0) return sampleChallenges[0]; // fallback extremo
        return filtered[Math.floor(Math.random() * filtered.length)];
    };

    const determineNextState = (cats, settings) => {
        const chance = getMinigameChance(settings.difficulty);
        const isMinigame = Math.random() < chance;
        
        return isMinigame ? {
            gamePhase: 'MINIGAME_INTRO',
            currentMinigame: MINIGAMES[Math.floor(Math.random() * MINIGAMES.length)],
            currentChallengeData: null,
        } : {
            gamePhase: 'CHALLENGE',
            currentMinigame: null,
            currentChallengeData: getRandomChallenge(cats),
        };
    };

    useEffect(() => {
        const savedPlayers = localStorage.getItem('kamikazeGamePlayers');
        const savedSettings = localStorage.getItem('kamikazeGameSettings');
        const savedCategories = localStorage.getItem('kamikazeCategories');
        const savedGameplay = localStorage.getItem('kamikazeGameplaySettings');
        
        let loadedPlayers = [];
        let totalChallenges = 30;
        
        let loadedCats = { regular: true, epic: true, multiplayer: true };
        let loadedGameplay = { difficulty: 'medium', turnOrder: 'random', enableVibration: true, enableSounds: true };

        if (savedCategories) {
            try { loadedCats = JSON.parse(savedCategories); } catch (e) {}
        }
        if (savedGameplay) {
            try { loadedGameplay = { ...loadedGameplay, ...JSON.parse(savedGameplay) }; } catch (e) {}
        }

        setCategories(loadedCats);
        setGameplaySettings(loadedGameplay);

        if (savedPlayers) {
            try { loadedPlayers = JSON.parse(savedPlayers); } catch (e) {}
        }
        if (savedSettings) {
            try { 
                const s = JSON.parse(savedSettings); 
                if (s.totalChallenges) totalChallenges = s.totalChallenges;
            } catch (e) {}
        }

        if (!loadedPlayers || loadedPlayers.length === 0) {
            loadedPlayers = [
                { id: 1, name: 'Jugador 1' },
                { id: 2, name: 'Jugador 2' }
            ];
        }

        setGameState(prev => {
            const nextState = determineNextState(loadedCats, loadedGameplay);
            return {
                ...prev,
                players: loadedPlayers,
                totalChallenges,
                currentPlayerIdx: 0,
                challengesDrawn: 1,
                ...nextState
            };
        });
    }, []);

    const nextTurn = () => {
        setGameState(prev => {
            let nextIdx = (prev.currentPlayerIdx + 1) % prev.players.length;
            
            if (gameplaySettings.turnOrder === 'random' && prev.players.length > 1) {
                // Elegir aleatorio, pero que no sea el mismo
                do {
                    nextIdx = Math.floor(Math.random() * prev.players.length);
                } while (nextIdx === prev.currentPlayerIdx);
            }

            const nextState = determineNextState(categories, gameplaySettings);

            return {
                ...prev,
                currentPlayerIdx: nextIdx,
                challengesDrawn: prev.challengesDrawn + 1,
                ...nextState
            };
        });
    };

    const handleMinigameEnd = (results) => {
        nextTurn();
    };

    const handleEndGame = () => {
        setGameState(prev => ({
            ...prev,
            gamePhase: 'GAME_OVER'
        }));
    };

    const handlePlayAgain = () => {
        setGameState(prev => {
            const nextState = determineNextState(categories, gameplaySettings);
            return {
                ...prev,
                currentPlayerIdx: 0,
                challengesDrawn: 1,
                ...nextState
            };
        });
    };

    const startMinigame = () => {
        setGameState(prev => ({
            ...prev,
            gamePhase: 'MINIGAME'
        }));
    };

    const renderMinigame = () => {
        const { currentMinigame } = gameState;
        const commonProps = { 
            onClose: handleMinigameEnd, 
            players: gameState.players,
            enableVibration: gameplaySettings.enableVibration
        };

        switch (currentMinigame) {
            case 'race': return <AxolotlRaceMinigame {...commonProps} />;
            case 'bomb': return <TimeBombMinigame currentPlayer={gameState.players[gameState.currentPlayerIdx]} {...commonProps} />;
            case 'sniper': return <BlindSniperMinigame currentPlayer={gameState.players[gameState.currentPlayerIdx]} {...commonProps} />;
            case 'roulette': return <FingerRouletteMinigame {...commonProps} />;
            case 'pong': return <PongtePedoMinigame {...commonProps} />;
            case 'cards': return <HighLowCardMinigame currentPlayer={gameState.players[gameState.currentPlayerIdx]} {...commonProps} />;
            case 'sequence': return <ToxicSequenceMinigame currentPlayer={gameState.players[gameState.currentPlayerIdx]} {...commonProps} />;
            default: return null;
        }
    };

    const isLastChallenge = gameState.challengesDrawn >= gameState.totalChallenges;

    return (
        <div className="relative min-h-screen bg-cover bg-center bg-no-repeat overflow-hidden flex flex-col" style={{ backgroundImage: `url(${bgImage})` }}>
            
            <div className="absolute inset-0 bg-background/85 backdrop-blur-sm z-0"></div>

            {/* UI SUPERIOR */}
            <div className="absolute top-0 left-0 p-4 z-20">
                <button
                    onClick={() => setIsPaused(true)}
                    className="bg-black/40 p-3 rounded-xl border border-white/20 text-white hover:bg-black/60 backdrop-blur-md transition-all shadow-lg"
                >
                    <span className="text-xl">⏸️</span>
                </button>
            </div>

            {/* AREA PRINCIPAL DE JUEGO */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 pt-16">
                
                {/* INDICADOR DE TURNO REDISEÑADO (ARRIBA DEL RETO) */}
                <div className="mb-6 flex flex-col items-center animate-fade-in text-center">
                    <span className="text-xs text-white/70 uppercase tracking-widest font-bold mb-2">
                        Turno de
                    </span>
                    <div className="bg-zinc-900/80 backdrop-blur-md border border-white/10 px-8 py-3 rounded-2xl shadow-xl transform transition-transform hover:scale-105">
                        <h1 className="text-3xl font-heading text-cyan-400 drop-shadow-md">
                            {gameState.players[gameState.currentPlayerIdx]?.name || '...'}
                        </h1>
                    </div>
                    <span className="text-xs text-white/50 mt-4 bg-black/40 border border-white/5 px-4 py-1.5 rounded-full font-medium">
                        Progreso: {gameState.challengesDrawn} / {gameState.totalChallenges}
                    </span>
                </div>

                <div className="w-full max-w-md">
                    <AnimatePresence mode="wait">
                        {gameState.gamePhase === 'CHALLENGE' && gameState.currentChallengeData && (
                            <ChallengeCard 
                                key={`challenge-${gameState.challengesDrawn}`}
                                challenge={gameState.currentChallengeData}
                                currentChallenge={gameState.challengesDrawn}
                                totalChallenges={gameState.totalChallenges}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* INTRO DE MINIJUEGO */}
            <AnimatePresence>
                {gameState.gamePhase === 'MINIGAME_INTRO' && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                        <div className="bg-zinc-900 border border-purple-500/50 rounded-3xl p-8 max-w-sm w-full text-center shadow-[0_0_50px_rgba(168,85,247,0.3)] animate-bounce-in">
                            <span className="inline-block px-4 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-bold tracking-widest uppercase mb-4 border border-purple-500/30">
                                ¡Evento Especial!
                            </span>
                            <h2 className="text-3xl font-heading text-white mb-2">
                                {MINIGAME_INFO[gameState.currentMinigame]?.title}
                            </h2>
                            <p className="text-white/70 mb-8">
                                {MINIGAME_INFO[gameState.currentMinigame]?.desc}
                            </p>

                            <div className="bg-black/40 rounded-2xl p-4 mb-8 border border-white/5">
                                {MINIGAME_INFO[gameState.currentMinigame]?.type === 'solo' ? (
                                    <>
                                        <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Le toca a</p>
                                        <p className="text-2xl font-bold text-cyan-400">{gameState.players[gameState.currentPlayerIdx]?.name}</p>
                                        <p className="text-xs text-white/40 mt-2">¡Pásenle el dispositivo!</p>
                                    </>
                                ) : MINIGAME_INFO[gameState.currentMinigame]?.type === 'vs' ? (
                                    <>
                                        <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Tipo de Juego</p>
                                        <p className="text-xl font-bold text-orange-400">¡1 VS 1!</p>
                                        <p className="text-xl font-bold text-cyan-400 mt-2">
                                            {gameState.players[gameState.currentPlayerIdx]?.name} <span className="text-white/50 text-base mx-1">VS</span> Retador
                                        </p>
                                        <p className="text-xs text-white/40 mt-2">¡Tomen los extremos del dispositivo!</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Tipo de Juego</p>
                                        <p className="text-xl font-bold text-emerald-400">¡GRUPAL!</p>
                                        <p className="text-xs text-white/40 mt-2">Acérquense a la pantalla</p>
                                    </>
                                )}
                            </div>

                            <button
                                onClick={startMinigame}
                                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg transform transition hover:scale-105 active:scale-95"
                            >
                                ¡ESTAMOS LISTOS!
                            </button>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* CONTROLES INFERIORES */}
            <div className="relative z-10 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <GameControls 
                    onNextChallenge={nextTurn}
                    onEndGame={handleEndGame}
                    isLastChallenge={isLastChallenge && gameState.gamePhase === 'CHALLENGE'}
                    currentChallenge={gameState.challengesDrawn}
                    totalChallenges={gameState.totalChallenges}
                />
            </div>

            {/* CAPA DE MINIJUEGOS */}
            <AnimatePresence>
                {gameState.gamePhase === 'MINIGAME' && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-lg">
                        {renderMinigame()}
                    </div>
                )}
            </AnimatePresence>

            {/* MENÚ DE PAUSA */}
            {isPaused && (
                <div className="z-[110] relative">
                    <PauseMenu
                        onResume={() => setIsPaused(false)}
                        onQuit={() => navigate('/')}
                    />
                </div>
            )}

            {/* PANTALLA DE FIN DE JUEGO */}
            <AnimatePresence>
                {gameState.gamePhase === 'GAME_OVER' && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg">
                        <div className="bg-zinc-900 border-2 border-red-500/50 rounded-3xl p-8 max-w-sm w-full text-center shadow-[0_0_50px_rgba(239,68,68,0.3)] animate-fade-in">
                            <span className="inline-block px-4 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold tracking-widest uppercase mb-4 border border-red-500/30">
                                Fin de la Partida
                            </span>
                            <h2 className="text-4xl font-heading text-white mb-2">
                                ¿AÚN SIGUEN VIVOS?
                            </h2>
                            <p className="text-white/70 mb-8">
                                Se acabaron los retos... pero la noche es joven. ¿Quieren otra ronda para terminar de destruirse o ya se van a dormir?
                            </p>

                            <div className="space-y-4">
                                <button
                                    onClick={handlePlayAgain}
                                    className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg transform transition hover:scale-105 active:scale-95"
                                >
                                    ¡JUGAR OTRA VEZ! (Mismos Jugadores)
                                </button>
                                
                                <button
                                    onClick={() => navigate('/player-setup')}
                                    className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10 font-bold rounded-xl shadow-lg transform transition hover:scale-105 active:scale-95"
                                >
                                    Cambiar Jugadores
                                </button>

                                <button
                                    onClick={() => navigate('/')}
                                    className="w-full py-3 text-white/50 hover:text-white underline text-sm"
                                >
                                    Ya me dio sueño (Ir al Inicio)
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ActiveGameSession;