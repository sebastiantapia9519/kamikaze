import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useGameEffects } from '../../../hooks/useGameEffects';

// Configuración de los 6 botones radiactivos
const GAME_PADS = [
    { id: 0, icon: 'Beer', color: 'bg-yellow-500', text: 'text-yellow-400', sound: 'tick' },
    { id: 1, icon: 'Wine', color: 'bg-red-500', text: 'text-red-400', sound: 'tick' },
    { id: 2, icon: 'Martini', color: 'bg-emerald-500', text: 'text-emerald-400', sound: 'tick' },
    { id: 3, icon: 'Zap', color: 'bg-blue-500', text: 'text-blue-400', sound: 'tick' },
    { id: 4, icon: 'Skull', color: 'bg-purple-500', text: 'text-purple-400', sound: 'tick' },
    { id: 5, icon: 'Flame', color: 'bg-orange-500', text: 'text-orange-400', sound: 'tick' }
];

const TARGET_LEVEL = 5;

/**
 * Minijuego de Secuencia Tóxica 2.0.
 * Mucho más difícil: 6 botones, y cada nivel genera una secuencia COMPLETAMENTE NUEVA.
 * Longitud de la secuencia = 2 + (nivel * 2). (Nivel 1 = 4, Nivel 5 = 12).
 */
const ToxicSequenceMinigame = ({ onClose }) => {
    const { playSound, triggerHaptic } = useGameEffects();

    const [sequence, setSequence] = useState([]);
    const [gameState, setGameState] = useState('START'); // START, SHOWING, INPUT, WON, LOST
    const [level, setLevel] = useState(1);
    const [activePad, setActivePad] = useState(null);

    // CONTROL DE REPRODUCCIÓN
    const [playbackIdx, setPlaybackIdx] = useState(-1);
    
    // Referencia de input
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

            // Encender
            const padId = sequence[playbackIdx];
            setActivePad(padId);
            playSound(GAME_PADS[padId].sound);

            // Velocidad endemoniada para secuencias largas
            const speed = Math.max(150, 400 - (level * 30));

            // Programar apagado
            timeout1.current = setTimeout(() => {
                setActivePad(null);
                // Pausa ultra rápida entre luces
                timeout2.current = setTimeout(() => {
                    setPlaybackIdx(prev => prev + 1);
                }, 80);
            }, speed);

            return () => {
                clearTimeout(timeout1.current);
                clearTimeout(timeout2.current);
            };
        }
    }, [gameState, playbackIdx, sequence, level, playSound]);

    /**
     * Inicia el juego.
     */
    const startGame = () => {
        setSequence([]);
        playerInputRef.current = [];
        setLevel(1);
        generateNewSequenceForLevel(1);
    };

    /**
     * Genera una secuencia COMPLETAMENTE NUEVA basada en el nivel actual.
     * Nivel 1: 4 luces. Nivel 2: 6 luces. Nivel 3: 8 luces...
     * @param {number} currentLevel
     */
    const generateNewSequenceForLevel = (currentLevel) => {
        const length = 2 + (currentLevel * 2);
        const newSeq = [];
        for (let i = 0; i < length; i++) {
            newSeq.push(Math.floor(Math.random() * GAME_PADS.length));
        }
        
        setSequence(newSeq);
        setGameState('SHOWING');
        setTimeout(() => setPlaybackIdx(0), 600);
    };

    /**
     * Maneja el clic del jugador.
     */
    const handlePadClick = (padId) => {
        if (gameState !== 'INPUT') return;

        // Feedback visual y sonoro
        setActivePad(padId);
        playSound(GAME_PADS[padId].sound);
        setTimeout(() => setActivePad(null), 100);

        // Añadir entrada
        playerInputRef.current.push(padId);
        const currentInput = playerInputRef.current;
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
                    const nextLevel = level + 1;
                    setLevel(nextLevel);
                    setGameState('LEVEL_UP'); // Estado intermedio
                    
                    // Retraso y nueva secuencia
                    setTimeout(() => generateNewSequenceForLevel(nextLevel), 1500);
                }
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex flex-col items-center bg-gray-950 p-4 select-none touch-manipulation overflow-hidden">
            {/* Fondo Radiactivo que pulsa cuando muestra la secuencia */}
            <motion.div 
                className="absolute inset-0 pointer-events-none opacity-20"
                animate={{
                    backgroundColor: gameState === 'SHOWING' ? ['#000000', '#166534', '#000000'] : '#000000',
                }}
                transition={{ duration: 1, repeat: Infinity }}
            />

            <div className="w-full flex justify-between items-center mb-6 z-10 relative mt-4">
                <h2 className="text-xl font-black text-white flex items-center gap-2 uppercase tracking-widest drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]">
                    <Icon name="Activity" className="text-pink-500" /> Secuencia Tóxica
                </h2>
                {gameState !== 'SHOWING' && gameState !== 'INPUT' && gameState !== 'LEVEL_UP' && (
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-full backdrop-blur-md">
                        <Icon name="X" size={24} />
                    </button>
                )}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm relative z-10">
                <div className="mb-8 text-center bg-gray-900/80 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/5 shadow-2xl">
                    <p className="text-gray-500 text-xs font-black uppercase tracking-[0.2em] mb-1">Peligro Biológico</p>
                    <div className="text-6xl font-black text-white flex items-baseline justify-center gap-1 drop-shadow-md">
                        {level} <span className="text-2xl text-gray-600">/ {TARGET_LEVEL}</span>
                    </div>
                    <div className="h-8 flex items-center justify-center mt-2">
                        {gameState === 'SHOWING' && <span className="text-sm font-black text-yellow-400 uppercase tracking-widest animate-pulse drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]">👁️ Memoriza ({sequence.length})</span>}
                        {gameState === 'INPUT' && <span className="text-sm font-black text-green-400 uppercase tracking-widest drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">👉 ¡Tu turno!</span>}
                        {gameState === 'LEVEL_UP' && <span className="text-sm font-black text-cyan-400 uppercase tracking-widest animate-bounce drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">¡Siguiente!</span>}
                    </div>
                </div>

                {/* GRID DE 3x2 CON BOTONES REDONDOS */}
                <div className="grid grid-cols-3 gap-4 sm:gap-6 w-full mb-8 relative z-10">
                    {GAME_PADS.map((pad) => (
                        <button
                            key={pad.id}
                            onPointerDown={() => handlePadClick(pad.id)}
                            className={`relative aspect-square rounded-full flex items-center justify-center transition-all duration-75 overflow-hidden border-4 border-transparent
                                ${activePad === pad.id
                                    ? `${pad.color} scale-110 shadow-[0_0_40px_rgba(255,255,255,0.6)] border-white z-20 brightness-125`
                                    : `bg-gray-800 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] border-white/5`
                                }
                                ${gameState !== 'INPUT' ? 'opacity-90 pointer-events-none' : 'active:scale-90 cursor-pointer hover:border-white/20'}
                            `}
                        >
                            <div className={`absolute inset-0 opacity-20 ${pad.color} rounded-full`}></div>
                            <Icon name={pad.icon} size={40} className={`relative z-10 transition-transform duration-100 ${activePad === pad.id ? 'scale-125 text-white drop-shadow-[0_0_10px_rgba(255,255,255,1)]' : pad.text}`} />
                        </button>
                    ))}
                </div>

                <AnimatePresence>
                    {gameState === 'START' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-gray-950/95 backdrop-blur-md flex flex-col items-center justify-center z-30 p-6 text-center rounded-[3rem] border border-white/10 shadow-2xl">
                            <div className="w-24 h-24 bg-pink-500/20 rounded-full flex items-center justify-center mb-6 border border-pink-500/50 shadow-[0_0_30px_rgba(236,72,153,0.3)]">
                                <Icon name="Brain" size={48} className="text-pink-400" />
                            </div>
                            <h3 className="text-4xl font-black text-white mb-4 uppercase tracking-wider">Amnesia</h3>
                            <p className="text-gray-400 mb-8 text-sm leading-relaxed max-w-[250px]">
                                <strong className="text-white">Reglas Extremas:</strong><br/>
                                La secuencia cambia por completo cada ronda. Cuentas con 6 botones.
                                <br/><br/>
                                <span className="text-yellow-400">Nivel 1 = 4 luces</span><br/>
                                <span className="text-red-400">Nivel 5 = 12 luces</span>
                            </p>
                            <Button onClick={startGame} className="w-full bg-pink-600 hover:bg-pink-500 text-white text-xl py-5 shadow-lg shadow-pink-600/30">
                                Iniciar Pesadilla
                            </Button>
                        </motion.div>
                    )}

                    {(gameState === 'LOST' || gameState === 'WON') && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`absolute inset-0 ${gameState === 'WON' ? 'bg-emerald-950/95 border-emerald-500/30' : 'bg-red-950/95 border-red-500/30'} backdrop-blur-md border flex flex-col items-center justify-center z-30 p-6 text-center rounded-[3rem] shadow-2xl`}>
                            <div className="text-8xl mb-6 filter drop-shadow-2xl">{gameState === 'WON' ? '🤯' : '☠️'}</div>
                            <h3 className={`text-5xl font-black mb-4 uppercase tracking-widest ${gameState === 'WON' ? 'text-emerald-400' : 'text-red-500'}`}>
                                {gameState === 'WON' ? '¡GENIO!' : 'FRACASO'}
                            </h3>
                            <p className="text-gray-300 font-medium mb-8 text-lg">
                                {gameState === 'WON' ? 'Lograste sobrevivir al nivel máximo.' : `Tu cerebro se fundió en el Nivel ${level}.`}
                            </p>
                            
                            {gameState === 'LOST' && (
                                <div className="bg-red-950 p-6 rounded-3xl border-2 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)] animate-pulse mb-8 w-full">
                                    <p className="text-red-400 text-sm font-bold uppercase tracking-widest mb-1">Castigo</p>
                                    <span className="text-4xl font-black text-white">BEBE {12 - sequence.length}</span>
                                </div>
                            )}
                            
                            <Button onClick={onClose} className={`w-full py-4 text-lg ${gameState === 'WON' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'} text-white shadow-lg`}>
                                Aceptar Destino
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ToxicSequenceMinigame;