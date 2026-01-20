import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useGameEffects } from '../../../hooks/useGameEffects';

// Configuración de los 4 botones
const GAME_PADS = [
    { id: 0, icon: 'Beer', color: 'bg-yellow-500', text: 'text-yellow-400', sound: 'tick' },
    { id: 1, icon: 'Wine', color: 'bg-red-500', text: 'text-red-400', sound: 'tick' },
    { id: 2, icon: 'Martini', color: 'bg-emerald-500', text: 'text-emerald-400', sound: 'tick' },
    { id: 3, icon: 'Zap', color: 'bg-blue-500', text: 'text-blue-400', sound: 'tick' }
];

const TARGET_LEVEL = 5; // Nivel objetivo para salvarse

const ToxicSequenceMinigame = ({ onClose }) => {
    const { playSound, vibrate } = useGameEffects();

    // --- ESTADOS ---
    const [sequence, setSequence] = useState([]);     // La secuencia correcta (ej: [0, 2, 0, 1])
    const [playerInput, setPlayerInput] = useState([]); // Lo que lleva el jugador
    const [gameState, setGameState] = useState('START'); // 'START', 'SHOWING', 'INPUT', 'WON', 'LOST'
    const [level, setLevel] = useState(1);
    const [activePad, setActivePad] = useState(null); // Cuál botón está brillando actualmente

    const timeoutRef = useRef(null);

    // --- LÓGICA DEL JUEGO ---

    // Iniciar el juego
    const startGame = () => {
        setSequence([]);
        setPlayerInput([]);
        setLevel(1);
        setGameState('SHOWING');
        addToSequence();
    };

    // Agregar un paso random a la secuencia
    const addToSequence = useCallback(() => {
        const nextPad = Math.floor(Math.random() * GAME_PADS.length);
        setSequence(prev => [...prev, nextPad]);
    }, []);

    // Función para "iluminar" un botón brevemente
    const flashPad = useCallback((padId) => {
        setActivePad(padId);
        playSound(GAME_PADS[padId].sound);
        vibrate(50);

        setTimeout(() => {
            setActivePad(null);
        }, 400); // Duración del brillo
    }, [playSound, vibrate]);

    // Reproducir la secuencia actual
    useEffect(() => {
        if (gameState === 'SHOWING' && sequence.length > 0) {
            let i = 0;

            const playNext = () => {
                if (i < sequence.length) {
                    flashPad(sequence[i]);
                    i++;
                    // Velocidad aumenta con el nivel
                    const delay = Math.max(400, 800 - (level * 50));
                    timeoutRef.current = setTimeout(playNext, delay);
                } else {
                    // Terminó de mostrar, turno del jugador
                    setGameState('INPUT');
                    setPlayerInput([]);
                }
            };

            // Pequeña pausa antes de empezar a mostrar
            timeoutRef.current = setTimeout(playNext, 1000);

            return () => clearTimeout(timeoutRef.current);
        }
    }, [gameState, sequence, level, flashPad]);

    // Manejar el clic del jugador
    const handlePadClick = (padId) => {
        if (gameState !== 'INPUT') return;

        flashPad(padId); // Feedback visual inmediato

        const newInput = [...playerInput, padId];
        setPlayerInput(newInput);

        // Verificar el último paso
        const currentStepIndex = newInput.length - 1;

        if (newInput[currentStepIndex] !== sequence[currentStepIndex]) {
            // ERROR: Perdió
            setGameState('LOST');
            playSound('explode');
            vibrate([200, 100, 200, 100, 500]);
        } else {
            // CORRECTO: ¿Terminó la secuencia?
            if (newInput.length === sequence.length) {
                if (level >= TARGET_LEVEL) {
                    // ¡GANÓ EL JUEGO!
                    setGameState('WON');
                    playSound('win');
                } else {
                    // Siguiente nivel
                    setLevel(prev => prev + 1);
                    setGameState('SHOWING');
                    setTimeout(addToSequence, 500);
                }
            }
        }
    };

    // --- RENDERIZADO ---
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center bg-gray-900 p-4 select-none">
            {/* HEADER */}
            <div className="w-full flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Icon name="Brain" className="text-pink-400" /> Secuencia Tóxica
                </h2>
                {gameState !== 'SHOWING' && gameState !== 'INPUT' && (
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <Icon name="X" size={24} />
                    </button>
                )}
            </div>

            <div className="flex-1 flex flex-col items-center justify-start w-full max-w-sm relative animate-fade-in">

                {/* INDICADOR DE NIVEL */}
                <div className="mb-8 text-center">
                    <p className="text-gray-400 text-sm uppercase tracking-widest">Nivel Actual</p>
                    <div className="text-5xl font-black text-white flex items-baseline justify-center gap-1">
                        {level} <span className="text-xl text-gray-500">/ {TARGET_LEVEL}</span>
                    </div>
                    <p className={`text-sm font-bold mt-2 h-6 ${gameState === 'SHOWING' ? 'text-yellow-400 animate-pulse' : 'text-green-400'}`}>
                        {gameState === 'SHOWING' ? '👁️ Memoriza la secuencia...' : (gameState === 'INPUT' ? '👉 ¡Tu turno! Repítela' : '')}
                    </p>
                </div>

                {/* TABLERO DE JUEGO (2x2) */}
                <div className="grid grid-cols-2 gap-4 w-full aspect-square mb-8 relative z-10">
                    {GAME_PADS.map((pad) => (
                        <motion.button
                            key={pad.id}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handlePadClick(pad.id)}
                            className={`relative rounded-3xl flex items-center justify-center transition-all duration-100 overflow-hidden border-4 border-transparent
                                ${activePad === pad.id
                                    ? `${pad.color} scale-105 shadow-[0_0_40px_${pad.color.replace('bg-', '')}] border-white z-20 brightness-125`
                                    : `${pad.color}/20 hover:${pad.color}/40 ${pad.text}`
                                }
                                ${gameState !== 'INPUT' ? 'pointer-events-none' : 'cursor-pointer'}
                            `}
                        >
                            <Icon name={pad.icon} size={64} className={`drop-shadow-lg transition-transform ${activePad === pad.id ? 'scale-125 text-white' : ''}`} />
                        </motion.button>
                    ))}
                </div>

                {/* PANTALLAS DE ESTADO (OVERLAYS) */}
                <AnimatePresence>
                    {gameState === 'START' && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-gray-900/90 backdrop-blur-sm flex flex-col items-center justify-center z-30 p-6 text-center rounded-3xl"
                        >
                            <Icon name="Brain" size={64} className="text-pink-500 mb-4" />
                            <h3 className="text-3xl font-black text-white mb-2">¿Qué tan buena es tu memoria?</h3>
                            <p className="text-gray-300 mb-6">Repite la secuencia de bebidas. Llega al Nivel {TARGET_LEVEL} para salvarte.</p>
                            <Button onClick={startGame} className="w-full text-lg py-4">¡Comenzar!</Button>
                        </motion.div>
                    )}

                    {gameState === 'LOST' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 bg-red-900/95 flex flex-col items-center justify-center z-30 p-6 text-center rounded-3xl"
                        >
                            <div className="text-8xl mb-4">🤯</div>
                            <h3 className="text-4xl font-black text-white mb-2">¡TE EQUIVOCASTE!</h3>
                            <p className="text-xl text-red-200 font-bold mb-6">
                                Llegaste al Nivel {level}.<br />
                                Te faltaron {TARGET_LEVEL - level + 1} niveles.
                            </p>
                            <div className="bg-black/30 p-4 rounded-2xl border border-red-500/50 animate-bounce">
                                <span className="text-3xl font-black text-white">BEBE {Math.max(1, TARGET_LEVEL - level + 1)} TRAGOS</span>
                            </div>
                            <Button onClick={onClose} className="w-full mt-8 bg-white/10 hover:bg-white/20">Salir humillado</Button>
                        </motion.div>
                    )}

                    {gameState === 'WON' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 bg-green-900/95 flex flex-col items-center justify-center z-30 p-6 text-center rounded-3xl"
                        >
                            <div className="text-8xl mb-4">🧠✨</div>
                            <h3 className="text-4xl font-black text-white mb-2">¡CEREBRO DE ORO!</h3>
                            <p className="text-xl text-green-200 font-bold mb-6">
                                Completaste el Nivel {TARGET_LEVEL}.
                            </p>
                            <div className="bg-black/30 p-4 rounded-2xl border border-green-500/50">
                                <span className="text-2xl font-black text-white">¡TE SALVASTE!</span>
                                <span className="block text-sm mt-1">Pasa el turno con orgullo.</span>
                            </div>
                            <Button onClick={onClose} className="w-full mt-8 bg-white/10 hover:bg-white/20">Continuar Partida</Button>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default ToxicSequenceMinigame;