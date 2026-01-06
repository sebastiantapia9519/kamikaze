import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TimeBombMinigame = ({ onClose }) => {
    const [gameState, setGameState] = useState('intro'); // intro, ticking, exploded
    const [timeLeft, setTimeLeft] = useState(0);
    const [fuseProgress, setFuseProgress] = useState(100);

    // Referencias para manejar los timers sin re-renders locos
    const explosionTimeRef = useRef(0);
    const intervalRef = useRef(null);
    const durationRef = useRef(0);

    // Configuración de la bomba
    const MIN_DURATION = 10000; // 10 segundos
    const MAX_DURATION = 35000; // 35 segundos

    // Efecto de vibración (Haptic Feedback)
    const vibrate = (pattern) => {
        if (navigator.vibrate) navigator.vibrate(pattern);
    };

    const startBomb = () => {
        const randomDuration = Math.floor(Math.random() * (MAX_DURATION - MIN_DURATION + 1)) + MIN_DURATION;
        durationRef.current = randomDuration;
        explosionTimeRef.current = Date.now() + randomDuration;

        setGameState('ticking');
        vibrate(200); // Vibración inicial

        // Loop del reloj
        intervalRef.current = setInterval(() => {
            const now = Date.now();
            const remaining = explosionTimeRef.current - now;
            const progress = (remaining / durationRef.current) * 100;

            if (remaining <= 0) {
                explode();
            } else {
                setTimeLeft(remaining);
                setFuseProgress(progress);

                // Vibración progresiva: entre menos tiempo, más vibra
                if (remaining < 5000 && Math.random() > 0.5) vibrate(50);
                else if (remaining < 3000) vibrate(100);
            }
        }, 50);
    };

    const explode = () => {
        clearInterval(intervalRef.current);
        setGameState('exploded');
        vibrate([500, 100, 500, 100, 1000]); // Vibración de explosión
    };

    useEffect(() => {
        return () => clearInterval(intervalRef.current);
    }, []);

    // Variantes de animación para la bomba (latido y temblor)
    const bombVariants = {
        ticking: {
            scale: [1, 1.05, 1],
            rotate: [-2, 2, -2],
            transition: {
                duration: gameState === 'ticking' && timeLeft < 5000 ? 0.2 : 0.8,
                repeat: Infinity
            }
        },
        exploded: {
            scale: 20,
            opacity: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <motion.div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-colors duration-200 ${gameState === 'exploded' ? 'bg-red-600' :
                    gameState === 'ticking' && timeLeft < 5000 ? 'bg-red-900/90' : 'bg-black/95'
                }`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
            <div className="max-w-md w-full text-center relative z-10">

                {/* --- FASE 1: INTRO --- */}
                {gameState === 'intro' && (
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="space-y-6">
                        <div className="bg-gray-800 p-8 rounded-3xl border-2 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]">
                            <Icon name="Bomb" size={80} className="text-red-500 mx-auto mb-4" />
                            <h2 className="text-4xl font-black text-white uppercase italic transform -skew-x-6">¡BOMBA!</h2>
                            <p className="text-gray-300 text-lg mt-4 leading-relaxed">
                                Pásense el celular <span className="text-yellow-400 font-bold">RÁPIDO</span>.
                                <br />Decidiremos quién bebe al azar.
                            </p>
                            <div className="bg-black/40 p-4 rounded-xl mt-6">
                                <p className="text-red-400 font-bold text-sm uppercase">Regla:</p>
                                <p className="text-white">Al que le explote en la mano se toma <span className="text-2xl font-black">5 TRAGOS</span>.</p>
                            </div>
                        </div>
                        <Button
                            onClick={startBomb}
                            size="lg"
                            className="w-full bg-red-600 hover:bg-red-500 text-white font-black text-xl py-6 animate-pulse"
                        >
                            ENCENDER MECHA 🔥
                        </Button>
                    </motion.div>
                )}

                {/* --- FASE 2: TIC TAC --- */}
                {gameState === 'ticking' && (
                    <div className="space-y-12">
                        <div className="text-center space-y-2">
                            <h2 className="text-red-500 font-mono text-xl tracking-[0.5em] animate-pulse">PELIGRO</h2>
                            <p className="text-white text-sm opacity-50">PASA EL CELULAR</p>
                        </div>

                        <motion.div
                            variants={bombVariants}
                            animate="ticking"
                            className="relative"
                        >
                            <Icon name="Bomb" size={180} className={`${timeLeft < 5000 ? 'text-red-500' : 'text-gray-100'} transition-colors duration-300`} />
                            {/* Mecha visual */}
                            <div className="absolute -top-4 right-1/3">
                                <motion.div
                                    animate={{ opacity: [1, 0.5, 1] }}
                                    transition={{ duration: 0.1, repeat: Infinity }}
                                >
                                    <Icon name="Zap" size={40} className="text-yellow-400" />
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Barra de progreso de la mecha (opcional, para dar ansiedad) */}
                        <div className="w-full bg-gray-800 h-4 rounded-full overflow-hidden border border-gray-600">
                            <motion.div
                                className="h-full bg-gradient-to-r from-yellow-500 to-red-600"
                                style={{ width: `${fuseProgress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* --- FASE 3: EXPLOSIÓN --- */}
                {gameState === 'exploded' && (
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="space-y-8"
                    >
                        <div className="bg-white text-black p-8 rounded-3xl shadow-2xl transform rotate-1">
                            <h1 className="text-6xl font-black text-red-600 mb-2">¡BOOM!</h1>
                            <p className="text-2xl font-bold uppercase">Te moriste.</p>
                            <div className="my-6 border-t-4 border-black border-dashed w-full opacity-20"></div>
                            <p className="text-lg font-medium">Tu castigo:</p>
                            <p className="text-5xl font-black mt-2">🍺 FONDO</p>
                            <p className="text-sm text-gray-500 mt-1">(O 5 tragos grandes)</p>
                        </div>

                        <Button onClick={onClose} className="w-full bg-black hover:bg-gray-900 border-2 border-white text-white font-bold py-4">
                            Sobreviví (Siguiente Ronda)
                        </Button>
                    </motion.div>
                )}

            </div>

            {/* Efectos de fondo en explosión */}
            {gameState === 'exploded' && (
                <motion.div
                    className="absolute inset-0 bg-orange-500 z-0"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                />
            )}
        </motion.div>
    );
};

export default TimeBombMinigame;