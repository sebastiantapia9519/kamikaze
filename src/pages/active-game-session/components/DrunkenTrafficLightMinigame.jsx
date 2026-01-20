import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useGameEffects } from '../../../hooks/useGameEffects';

const TARGET_SCORE = 5; // Aciertos necesarios para ganar
const TIME_LIMIT = 3;   // Segundos por ronda (presión de tiempo)

const DrunkenTrafficLightMinigame = ({ onClose }) => {
    const { playSound, vibrate } = useGameEffects();

    // --- ESTADOS ---
    const [gameState, setGameState] = useState('INSTRUCTIONS'); // INSTRUCTIONS, PLAYING, WON, LOST
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
    const [challenge, setChallenge] = useState(null); // { direction: 'LEFT'|'RIGHT', color: 'GREEN'|'RED' }

    const timerRef = useRef(null);

    // --- LÓGICA DEL JUEGO ---

    const generateChallenge = useCallback(() => {
        const directions = ['LEFT', 'RIGHT'];
        const colors = ['GREEN', 'RED'];

        const newDir = directions[Math.floor(Math.random() * directions.length)];
        const newColor = colors[Math.floor(Math.random() * colors.length)];

        setChallenge({ direction: newDir, color: newColor });
        setTimeLeft(TIME_LIMIT);
    }, []);

    const startGame = () => {
        setScore(0);
        setGameState('PLAYING');
        generateChallenge();
    };

    // Temporizador
    useEffect(() => {
        if (gameState === 'PLAYING') {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 0) {
                        handleGameOver();
                        return 0;
                    }
                    return prev - 0.1; // Actualización suave
                });
            }, 100);
        }
        return () => clearInterval(timerRef.current);
    }, [gameState]);

    const handleGameOver = () => {
        clearInterval(timerRef.current);
        setGameState('LOST');
        playSound('explode');
        vibrate([500, 200, 500]);
    };

    const handleInput = (inputDirection) => { // 'LEFT' o 'RIGHT'
        if (gameState !== 'PLAYING') return;

        // LÓGICA "SEMAFORO BORRACHO"
        // Verde = Obedecer flecha
        // Rojo = Lado contrario
        const correctDirection = challenge.color === 'GREEN'
            ? challenge.direction
            : (challenge.direction === 'LEFT' ? 'RIGHT' : 'LEFT');

        if (inputDirection === correctDirection) {
            // ACIERTO
            playSound('tick');
            vibrate(50);
            const newScore = score + 1;

            if (newScore >= TARGET_SCORE) {
                clearInterval(timerRef.current);
                setGameState('WON');
                playSound('win');
            } else {
                setScore(newScore);
                generateChallenge();
            }
        } else {
            // ERROR
            handleGameOver();
        }
    };

    // --- RENDERIZADO ---
    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-gray-900 select-none overflow-hidden">

            {/* BARRA SUPERIOR */}
            <div className="p-4 flex justify-between items-center bg-gray-800/50">
                <div className="flex items-center gap-2">
                    <Icon name="Activity" className="text-yellow-400" />
                    <span className="text-white font-bold">Semáforo Borracho</span>
                </div>
                {gameState !== 'PLAYING' && (
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <Icon name="X" size={24} />
                    </button>
                )}
            </div>

            {/* ÁREA DE JUEGO */}
            <div className="flex-1 flex flex-col items-center justify-center relative p-4">

                {/* MARCADOR */}
                {gameState === 'PLAYING' && (
                    <div className="absolute top-4 flex gap-2 mb-4">
                        {Array.from({ length: TARGET_SCORE }).map((_, i) => (
                            <div
                                key={i}
                                className={`w-4 h-4 rounded-full border border-white/20 transition-all ${i < score ? 'bg-green-500 scale-110 shadow-glow' : 'bg-gray-700'}`}
                            />
                        ))}
                    </div>
                )}

                {/* FLECHA GIGANTE (SOLO JUGANDO) */}
                {gameState === 'PLAYING' && challenge && (
                    <div className="flex flex-col items-center animate-pop-in">
                        <motion.div
                            key={score} // Re-render animation on change
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`transition-colors duration-200 ${challenge.color === 'GREEN' ? 'text-green-500 drop-shadow-[0_0_30px_rgba(34,197,94,0.6)]' : 'text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.6)]'}`}
                        >
                            {/* Rotamos el icono según la dirección */}
                            <Icon
                                name="ArrowRight"
                                size={180}
                                className={`transform transition-transform ${challenge.direction === 'LEFT' ? 'rotate-180' : ''}`}
                            />
                        </motion.div>

                        {/* BARRA DE TIEMPO */}
                        <div className="w-48 h-2 bg-gray-800 rounded-full mt-8 overflow-hidden">
                            <motion.div
                                className={`h-full ${timeLeft < 1 ? 'bg-red-500' : 'bg-yellow-400'}`}
                                style={{ width: `${(timeLeft / TIME_LIMIT) * 100}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* PANTALLAS DE ESTADO (Instrucciones / Ganar / Perder) */}
                <AnimatePresence>
                    {gameState === 'INSTRUCTIONS' && (
                        <motion.div className="absolute inset-0 bg-gray-900/95 flex flex-col items-center justify-center p-8 text-center z-20">
                            <Icon name="Shuffle" size={64} className="text-yellow-400 mb-4" />
                            <h2 className="text-3xl font-black text-white mb-4">¡NO TE CONFUNDAS!</h2>
                            <div className="space-y-4 text-left bg-gray-800 p-6 rounded-2xl border border-white/10 w-full max-w-sm">
                                <div className="flex items-center gap-4">
                                    <Icon name="ArrowRight" className="text-green-500" />
                                    <span className="text-gray-300">Si es <b className="text-green-400">VERDE</b>: Sigue la flecha.</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Icon name="ArrowRight" className="text-red-500" />
                                    <span className="text-gray-300">Si es <b className="text-red-400">ROJA</b>: ¡Ve al lado contrario!</span>
                                </div>
                            </div>
                            <Button onClick={startGame} className="mt-8 w-full py-4 text-xl">¡Listo!</Button>
                        </motion.div>
                    )}

                    {gameState === 'LOST' && (
                        <motion.div className="absolute inset-0 bg-red-900/95 flex flex-col items-center justify-center p-6 text-center z-20">
                            <div className="text-8xl mb-4">🥴</div>
                            <h2 className="text-4xl font-black text-white mb-2">¡TE TRABASTE!</h2>
                            <p className="text-red-200 text-lg mb-6">Tu cerebro hizo corto circuito.</p>
                            <div className="bg-black/30 p-4 rounded-2xl border border-red-500/50 animate-bounce">
                                <span className="text-3xl font-black text-white">FONDO</span>
                            </div>
                            <Button onClick={onClose} className="mt-8 w-full bg-white/10">Salir</Button>
                        </motion.div>
                    )}

                    {gameState === 'WON' && (
                        <motion.div className="absolute inset-0 bg-green-900/95 flex flex-col items-center justify-center p-6 text-center z-20">
                            <div className="text-8xl mb-4">🧠⚡</div>
                            <h2 className="text-4xl font-black text-white mb-2">¡NI UN ERROR!</h2>
                            <p className="text-green-200 text-lg mb-6">Sobreviviste al semáforo.</p>
                            <div className="bg-black/30 p-4 rounded-2xl border border-green-500/50">
                                <span className="text-2xl font-black text-white">¡TE SALVAS!</span>
                            </div>
                            <Button onClick={onClose} className="mt-8 w-full bg-white/10">Continuar</Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* BOTONES DE CONTROL (IZQUIERDA / DERECHA) */}
            <div className="h-1/3 grid grid-cols-2 gap-1 p-1">
                <button
                    className="bg-gray-800 hover:bg-gray-700 active:bg-gray-600 rounded-l-2xl flex items-center justify-center border-t-4 border-l-4 border-gray-600 active:border-gray-800 transition-all"
                    onClick={() => handleInput('LEFT')}
                    disabled={gameState !== 'PLAYING'}
                >
                    <Icon name="ArrowLeft" size={48} className="text-white opacity-50" />
                </button>
                <button
                    className="bg-gray-800 hover:bg-gray-700 active:bg-gray-600 rounded-r-2xl flex items-center justify-center border-t-4 border-r-4 border-gray-600 active:border-gray-800 transition-all"
                    onClick={() => handleInput('RIGHT')}
                    disabled={gameState !== 'PLAYING'}
                >
                    <Icon name="ArrowRight" size={48} className="text-white opacity-50" />
                </button>
            </div>
        </div>
    );
};

export default DrunkenTrafficLightMinigame;