import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useGameEffects } from '../../../hooks/useGameEffects';

// Configuración de los botones/pads del juego de memoria
const GAME_PADS = [
    { id: 0, icon: 'Beer', color: 'bg-yellow-500', text: 'text-yellow-400', sound: 'tick' },
    { id: 1, icon: 'Wine', color: 'bg-red-500', text: 'text-red-400', sound: 'tick' },
    { id: 2, icon: 'Martini', color: 'bg-emerald-500', text: 'text-emerald-400', sound: 'tick' },
    { id: 3, icon: 'Zap', color: 'bg-blue-500', text: 'text-blue-400', sound: 'tick' }
];

const TARGET_LEVEL = 5;

/**
 * Minijuego de Secuencia Tóxica (Estilo "Simón Dice").
 * El juego reproduce una secuencia de luces/sonidos que el jugador debe memorizar
 * y repetir en el mismo orden. Cada ronda añade un paso a la secuencia.
 * Si el jugador alcanza el TARGET_LEVEL (5), gana. Si se equivoca, pierde.
 * 
 * @param {Object} props
 * @param {Function} props.onClose - Callback ejecutado al salir del minijuego.
 */
const ToxicSequenceMinigame = ({ onClose }) => {
    const { playSound, triggerHaptic } = useGameEffects();

    const [sequence, setSequence] = useState([]);
    const [gameState, setGameState] = useState('START'); // START, SHOWING, INPUT, WON, LOST
    const [level, setLevel] = useState(1);
    const [activePad, setActivePad] = useState(null);

    // CONTROL DE REPRODUCCIÓN (Evita que se trabe)
    const [playbackIdx, setPlaybackIdx] = useState(-1);
    
    // Usar una referencia para el input del jugador para evitar problemas de estado obsoleto al hacer clics rápidos
    const playerInputRef = useRef([]);
    const timeout1 = useRef(null);
    const timeout2 = useRef(null);

    // --- REPRODUCCIÓN SEGURA DE LA SECUENCIA ---
    useEffect(() => {
        if (gameState === 'SHOWING' && playbackIdx >= 0) {
            // Si ya terminamos de mostrar la secuencia...
            if (playbackIdx >= sequence.length) {
                const t = setTimeout(() => {
                    setGameState('INPUT');
                    playerInputRef.current = [];
                    setPlaybackIdx(-1);
                }, 300);
                return () => clearTimeout(t);
            }

            // Si toca encender una luz...
            const padId = sequence[playbackIdx];

            // 1. Encender
            setActivePad(padId);
            playSound(GAME_PADS[padId].sound);

            // Velocidad dinámica (más rápido en niveles altos)
            const speed = Math.max(300, 600 - (level * 50));

            // 2. Programar apagado y siguiente paso
            timeout1.current = setTimeout(() => {
                setActivePad(null);
                // Pausa breve entre luces para que se note el parpadeo
                timeout2.current = setTimeout(() => {
                    setPlaybackIdx(prev => prev + 1);
                }, 150);
            }, speed);

            return () => {
                clearTimeout(timeout1.current);
                clearTimeout(timeout2.current);
            };
        }
    }, [gameState, playbackIdx, sequence, level, playSound]);

    /**
     * Inicia el juego desde el nivel 1.
     */
    const startGame = () => {
        setSequence([]);
        playerInputRef.current = [];
        setLevel(1);
        addToSequence([]);
    };

    /**
     * Añade un nuevo paso aleatorio a la secuencia y la reproduce.
     * @param {number[]} currentSeq - La secuencia actual hasta el momento.
     */
    const addToSequence = (currentSeq) => {
        const nextPad = Math.floor(Math.random() * GAME_PADS.length);
        const newSeq = [...currentSeq, nextPad];
        setSequence(newSeq);
        setGameState('SHOWING');
        // Pequeño delay antes de iniciar la reproducción
        setTimeout(() => setPlaybackIdx(0), 500);
    };

    /**
     * Maneja el clic del jugador en uno de los botones (pads).
     * @param {number} padId - El ID numérico del botón pulsado (0-3).
     */
    const handlePadClick = (padId) => {
        if (gameState !== 'INPUT') return;

        // Feedback visual y sonoro
        setActivePad(padId);
        playSound(GAME_PADS[padId].sound);
        setTimeout(() => setActivePad(null), 150);

        // Añadir entrada del jugador a la referencia
        playerInputRef.current.push(padId);
        const currentInput = playerInputRef.current;

        // Verificar corrección
        const currentIndex = currentInput.length - 1;

        if (currentInput[currentIndex] !== sequence[currentIndex]) {
            // ERROR
            setGameState('LOST');
            playSound('explode');
            triggerHaptic(500);
        } else {
            // CORRECTO
            if (currentInput.length === sequence.length) {
                // Nivel completado
                if (level >= TARGET_LEVEL) {
                    setGameState('WON');
                    playSound('win');
                } else {
                    setLevel(l => l + 1);
                    // Retraso antes de iniciar la siguiente secuencia
                    setTimeout(() => addToSequence(sequence), 800);
                }
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center bg-gray-900 p-4 select-none touch-manipulation">
            <div className="w-full flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Icon name="Activity" className="text-pink-400" /> Secuencia Tóxica
                </h2>
                {gameState !== 'SHOWING' && gameState !== 'INPUT' && (
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <Icon name="X" size={24} />
                    </button>
                )}
            </div>

            <div className="flex-1 flex flex-col items-center justify-start w-full max-w-sm relative">
                <div className="mb-8 text-center">
                    <p className="text-gray-400 text-sm uppercase tracking-widest">Nivel Actual</p>
                    <div className="text-5xl font-black text-white flex items-baseline justify-center gap-1">
                        {level} <span className="text-xl text-gray-500">/ {TARGET_LEVEL}</span>
                    </div>
                    <p className={`text-sm font-bold mt-2 h-6 ${gameState === 'SHOWING' ? 'text-yellow-400 animate-pulse' : 'text-green-400'}`}>
                        {gameState === 'SHOWING' ? '👁️ Memoriza...' : (gameState === 'INPUT' ? '👉 ¡Tu turno!' : '')}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full aspect-square mb-8 relative z-10">
                    {GAME_PADS.map((pad) => (
                        <button
                            key={pad.id}
                            onPointerDown={() => handlePadClick(pad.id)} // PointerDown responde mejor en móviles
                            className={`relative rounded-3xl flex items-center justify-center transition-all duration-100 overflow-hidden border-4 border-transparent
                                ${activePad === pad.id
                                    ? `${pad.color} scale-105 shadow-[0_0_30px_rgba(255,255,255,0.5)] border-white z-20 brightness-110`
                                    : `${pad.color}/20 ${pad.text}`
                                }
                                ${gameState !== 'INPUT' ? 'opacity-80 pointer-events-none' : 'active:scale-95 cursor-pointer'}
                            `}
                        >
                            <Icon name={pad.icon} size={64} className={`drop-shadow-lg transition-transform ${activePad === pad.id ? 'scale-125 text-white' : ''}`} />
                        </button>
                    ))}
                </div>

                <AnimatePresence>
                    {gameState === 'START' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-gray-900/95 flex flex-col items-center justify-center z-30 p-6 text-center rounded-3xl">
                            <Icon name="Brain" size={64} className="text-pink-500 mb-4" />
                            <h3 className="text-3xl font-black text-white mb-2">Memoria</h3>
                            <p className="text-gray-300 mb-6">Repite la secuencia sin fallar.</p>
                            <Button onClick={startGame} className="w-full text-lg py-4">¡Comenzar!</Button>
                        </motion.div>
                    )}
                    {(gameState === 'LOST' || gameState === 'WON') && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`absolute inset-0 ${gameState === 'WON' ? 'bg-green-900/95' : 'bg-red-900/95'} flex flex-col items-center justify-center z-30 p-6 text-center rounded-3xl`}>
                            <div className="text-8xl mb-4">{gameState === 'WON' ? '🧠' : '🤯'}</div>
                            <h3 className="text-4xl font-black text-white mb-2">{gameState === 'WON' ? '¡GANASTE!' : '¡FALLASTE!'}</h3>
                            <p className="text-xl text-white font-bold mb-6">
                                {gameState === 'WON' ? 'Te salvaste.' : `Llegaste al Nivel ${level}.`}
                            </p>
                            {gameState === 'LOST' && (
                                <div className="bg-black/30 p-4 rounded-2xl border border-red-500/50 animate-bounce mb-4">
                                    <span className="text-3xl font-black text-white">BEBE {TARGET_LEVEL - level + 1}</span>
                                </div>
                            )}
                            <Button onClick={onClose} className="w-full bg-white/10 hover:bg-white/20">Continuar</Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ToxicSequenceMinigame;