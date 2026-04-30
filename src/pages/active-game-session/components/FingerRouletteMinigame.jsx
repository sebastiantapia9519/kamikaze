import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
 
const FINGER_COLORS = [
    { name: 'Azul',     hex: '#3B82F6', tw: 'bg-blue-500',   border: 'border-blue-400'   },
    { name: 'Rojo',     hex: '#EF4444', tw: 'bg-red-500',    border: 'border-red-400'    },
    { name: 'Verde',    hex: '#22C55E', tw: 'bg-green-500',  border: 'border-green-400'  },
    { name: 'Amarillo', hex: '#EAB308', tw: 'bg-yellow-500', border: 'border-yellow-400' },
    { name: 'Rosa',     hex: '#EC4899', tw: 'bg-pink-500',   border: 'border-pink-400'   },
    { name: 'Morado',   hex: '#A855F7', tw: 'bg-purple-500', border: 'border-purple-400' },
    { name: 'Cian',     hex: '#06B6D4', tw: 'bg-cyan-500',   border: 'border-cyan-400'   },
    { name: 'Naranja',  hex: '#F97316', tw: 'bg-orange-500', border: 'border-orange-400' },
];
 
const FingerRouletteMinigame = ({ onClose }) => {
    const [fingers, setFingers] = useState({});
    const [gameState, setGameState] = useState('WAITING');
    const [countdown, setCountdown] = useState(3);
    const [loserId, setLoserId] = useState(null);
    const [loserColorName, setLoserColorName] = useState('');
 
    // FIX: Usamos ref para acceder a fingers actual dentro de closures
    const fingersRef = useRef({});
    const timerRef = useRef(null);
    const availableColorsRef = useRef(new Set(FINGER_COLORS.map((_, i) => i)));
 
    // Sincronizamos el ref con el estado
    useEffect(() => {
        fingersRef.current = fingers;
    }, [fingers]);
 
    const handleTouchStart = (e) => {
        if (gameState === 'RESULT' || gameState === 'CHOOSING') return;
        e.preventDefault();
 
        const newFingers = { ...fingersRef.current };
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            let colorIndex = 0;
            if (availableColorsRef.current.size > 0) {
                const next = availableColorsRef.current.values().next().value;
                availableColorsRef.current.delete(next);
                colorIndex = next;
            } else {
                colorIndex = Math.floor(Math.random() * FINGER_COLORS.length);
            }
            newFingers[touch.identifier] = { x: touch.clientX, y: touch.clientY, colorIndex };
        }
 
        setFingers(newFingers);
        fingersRef.current = newFingers;
 
        if (Object.keys(newFingers).length >= 2 && gameState === 'WAITING' && !timerRef.current) {
            startCountdown();
        }
    };
 
    const handleTouchMove = (e) => {
        if (gameState === 'RESULT') return;
        e.preventDefault();
 
        const newFingers = { ...fingersRef.current };
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            if (newFingers[touch.identifier]) {
                newFingers[touch.identifier] = {
                    ...newFingers[touch.identifier],
                    x: touch.clientX,
                    y: touch.clientY,
                };
            }
        }
        setFingers(newFingers);
        fingersRef.current = newFingers;
    };
 
    const handleTouchEnd = (e) => {
        if (gameState === 'RESULT') return;
        e.preventDefault();
 
        const newFingers = { ...fingersRef.current };
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            if (newFingers[touch.identifier]) {
                availableColorsRef.current.add(newFingers[touch.identifier].colorIndex);
                delete newFingers[touch.identifier];
            }
        }
 
        setFingers(newFingers);
        fingersRef.current = newFingers;
 
        if (gameState === 'COUNTDOWN' || gameState === 'CHOOSING') {
            cancelGame();
        }
    };
 
    const startCountdown = () => {
        setGameState('COUNTDOWN');
        setCountdown(3);
        let count = 3;
 
        const interval = setInterval(() => {
            count--;
            setCountdown(count);
            if (count <= 0) {
                clearInterval(interval);
                timerRef.current = null;
                chooseLoser();
            }
        }, 1000);
        timerRef.current = interval;
    };
 
    const cancelGame = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setGameState('WAITING');
        setCountdown(3);
    };
 
    const chooseLoser = () => {
        setGameState('CHOOSING');
 
        setTimeout(() => {
            // FIX: Leemos de fingersRef (actual) no de fingers (puede ser stale)
            const currentFingers = fingersRef.current;
            const touchIds = Object.keys(currentFingers);
 
            if (touchIds.length === 0) {
                cancelGame();
                return;
            }
 
            const randomIndex = Math.floor(Math.random() * touchIds.length);
            const selectedLoserId = touchIds[randomIndex];
            const loserFinger = currentFingers[selectedLoserId];
            const colorName = FINGER_COLORS[loserFinger.colorIndex]?.name || 'Desconocido';
 
            setLoserId(selectedLoserId);
            setLoserColorName(colorName);
            setGameState('RESULT');
        }, 1500);
    };
 
    // Obtenemos el color del perdedor de forma segura
    const getLoserColor = () => {
        if (!loserId || !fingers[loserId]) return null;
        return FINGER_COLORS[fingers[loserId].colorIndex];
    };
 
    const loserColor = getLoserColor();
 
    return (
        <div
            className="fixed inset-0 z-50 bg-gray-900 touch-none select-none overflow-hidden"
            style={{ height: '100dvh', width: '100vw' }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
        >
            {/* Instrucciones de fondo */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6 text-center">
                {gameState === 'WAITING' && (
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2 }}>
                        <div className="text-8xl mb-4">👆</div>
                        <h2 className="text-4xl font-bold text-gray-400">Pongan los dedos</h2>
                        <p className="text-gray-600 mt-2 text-lg">Mínimo 2 jugadores</p>
                    </motion.div>
                )}
 
                {gameState === 'COUNTDOWN' && (
                    <motion.div
                        key={countdown}
                        initial={{ scale: 0.3, opacity: 0 }}
                        animate={{ scale: 1.6, opacity: 1 }}
                        exit={{ scale: 2, opacity: 0 }}
                        className="text-9xl font-black text-white drop-shadow-2xl"
                    >
                        {countdown === 0 ? '⚡' : countdown}
                    </motion.div>
                )}
 
                {gameState === 'CHOOSING' && (
                    <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.3 }}
                        className="text-6xl font-bold text-white"
                    >
                        🎯 Eligiendo...
                    </motion.div>
                )}
            </div>
 
            {/* Círculos en los dedos */}
            {Object.entries(fingers).map(([id, finger]) => {
                const isLoser = gameState === 'RESULT' && id === loserId;
                const isWinner = gameState === 'RESULT' && id !== loserId;
                const colorData = FINGER_COLORS[finger.colorIndex] || FINGER_COLORS[0];
 
                return (
                    <motion.div
                        key={id}
                        className="absolute top-0 left-0 pointer-events-none"
                        animate={{
                            x: finger.x - 50,
                            y: finger.y - 50,
                            scale: isLoser ? 1.8 : isWinner ? 0 : 1,
                            opacity: isWinner ? 0 : 1,
                        }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        style={{ width: 100, height: 100 }}
                    >
                        {/* Anillo animado exterior */}
                        <div
                            className="absolute inset-0 rounded-full border-4 opacity-40 animate-ping"
                            style={{ borderColor: colorData.hex }}
                        />
                        {/* Círculo interior */}
                        <div
                            className="absolute inset-3 rounded-full flex items-center justify-center border-2 border-white shadow-2xl"
                            style={{ backgroundColor: colorData.hex }}
                        >
                            {isLoser && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1, rotate: [0, 20, -20, 0] }}
                                    transition={{ repeat: Infinity, duration: 0.5 }}
                                >
                                    <Icon name="Skull" className="text-white" size={28} />
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                );
            })}
 
            {/* Resultado */}
            <AnimatePresence>
                {gameState === 'RESULT' && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="absolute bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-md rounded-t-3xl border-t border-white/10 p-8 text-center pointer-events-auto z-10"
                    >
                        <div className="text-6xl mb-4">💀</div>
                        <h2 className="text-4xl font-bold text-white mb-2">
                            ¡Perdió el{' '}
                            <span
                                className="font-black uppercase"
                                style={{ color: loserColor?.hex || 'white' }}
                            >
                                {loserColorName}
                            </span>
                            !
                        </h2>
                        <p className="text-gray-300 text-lg mb-6">
                            Ese dedo se toma un trago 🥃
                        </p>
                        <Button
                            onClick={onClose}
                            className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-lg rounded-2xl"
                        >
                            Cerrar
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
 
            {/* Botón salir */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-3 bg-gray-800/60 rounded-full text-gray-400 hover:text-white pointer-events-auto z-20 backdrop-blur-sm"
            >
                <Icon name="X" size={24} />
            </button>
        </div>
    );
};
 
export default FingerRouletteMinigame;