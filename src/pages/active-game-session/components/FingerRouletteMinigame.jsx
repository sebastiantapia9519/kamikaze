import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

// Colores neón para los dedos
const FINGER_COLORS = [
    { name: 'Azul', hex: '#3B82F6', tw: 'bg-blue-500', shadow: 'shadow-blue-500/50' },
    { name: 'Rojo', hex: '#EF4444', tw: 'bg-red-500', shadow: 'shadow-red-500/50' },
    { name: 'Verde', hex: '#22C55E', tw: 'bg-green-500', shadow: 'shadow-green-500/50' },
    { name: 'Amarillo', hex: '#EAB308', tw: 'bg-yellow-500', shadow: 'shadow-yellow-500/50' },
    { name: 'Rosa', hex: '#EC4899', tw: 'bg-pink-500', shadow: 'shadow-pink-500/50' },
    { name: 'Morado', hex: '#A855F7', tw: 'bg-purple-500', shadow: 'shadow-purple-500/50' },
    { name: 'Cian', hex: '#06B6D4', tw: 'bg-cyan-500', shadow: 'shadow-cyan-500/50' },
    { name: 'Naranja', hex: '#F97316', tw: 'bg-orange-500', shadow: 'shadow-orange-500/50' },
];

const FingerRouletteMinigame = ({ onClose }) => {
    // --- ESTADOS ---
    const [fingers, setFingers] = useState({}); // { touchId: { x, y, colorIndex } }
    const [gameState, setGameState] = useState('WAITING'); // 'WAITING', 'COUNTDOWN', 'CHOOSING', 'RESULT'
    const [countdown, setCountdown] = useState(3);
    const [loserId, setLoserId] = useState(null);
    const [loserColorName, setLoserColorName] = useState('');

    // Refs para lógica interna sin re-renderizar
    const timerRef = useRef(null);
    const availableColorsRef = useRef(new Set(FINGER_COLORS.map((_, i) => i)));

    // --- MANEJO DE TOQUES (TOUCH EVENTS) ---

    const handleTouchStart = (e) => {
        if (gameState === 'RESULT' || gameState === 'CHOOSING') return;

        const newFingers = { ...fingers };
        const changedTouches = e.changedTouches;

        for (let i = 0; i < changedTouches.length; i++) {
            const touch = changedTouches[i];

            // Asignar color disponible
            let colorIndex = 0;
            if (availableColorsRef.current.size > 0) {
                const nextColor = availableColorsRef.current.values().next().value;
                availableColorsRef.current.delete(nextColor);
                colorIndex = nextColor;
            } else {
                colorIndex = Math.floor(Math.random() * FINGER_COLORS.length);
            }

            newFingers[touch.identifier] = {
                x: touch.clientX,
                y: touch.clientY,
                colorIndex: colorIndex
            };
        }

        setFingers(newFingers);
        checkGameStart(Object.keys(newFingers).length);
    };

    const handleTouchMove = (e) => {
        if (gameState === 'RESULT') return;

        const newFingers = { ...fingers };
        const changedTouches = e.changedTouches;

        for (let i = 0; i < changedTouches.length; i++) {
            const touch = changedTouches[i];
            if (newFingers[touch.identifier]) {
                newFingers[touch.identifier] = {
                    ...newFingers[touch.identifier],
                    x: touch.clientX,
                    y: touch.clientY
                };
            }
        }
        setFingers(newFingers);
    };

    const handleTouchEnd = (e) => {
        if (gameState === 'RESULT') return;

        const newFingers = { ...fingers };
        const changedTouches = e.changedTouches;

        for (let i = 0; i < changedTouches.length; i++) {
            const touch = changedTouches[i];
            const fingerData = newFingers[touch.identifier];

            if (fingerData) {
                availableColorsRef.current.add(fingerData.colorIndex);
                delete newFingers[touch.identifier];
            }
        }

        setFingers(newFingers);

        if (gameState === 'COUNTDOWN' || gameState === 'CHOOSING') {
            cancelGame();
        }
    };

    // --- LÓGICA DEL JUEGO ---

    const checkGameStart = (fingerCount) => {
        if (fingerCount >= 2 && gameState === 'WAITING') {
            if (!timerRef.current) {
                startCountdown();
            }
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
            const touchIds = Object.keys(fingers);
            if (touchIds.length === 0) {
                cancelGame();
                return;
            }

            const randomIndex = Math.floor(Math.random() * touchIds.length);
            const selectedLoserId = touchIds[randomIndex];
            const loserFinger = fingers[selectedLoserId];
            const colorName = FINGER_COLORS[loserFinger.colorIndex].name;

            setLoserId(selectedLoserId);
            setLoserColorName(colorName);
            setGameState('RESULT');

        }, 1500);
    };

    // --- RENDERIZADO ---
    return (
        <div
            // CORRECCIÓN: Usamos h-[100dvh] para evitar problemas con la barra del navegador
            className="fixed inset-0 z-50 bg-gray-900 touch-none select-none overflow-hidden h-[100dvh] w-screen"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
        >
            {/* INSTRUCCIONES DE FONDO */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6 text-center select-none">
                {gameState === 'WAITING' && (
                    <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }}>
                        <Icon name="Hand" size={64} className="text-gray-600 mb-4 mx-auto" />
                        <h2 className="text-3xl font-bold text-gray-500">Pongan sus dedos</h2>
                        <p className="text-gray-600 mt-2">Mínimo 2 jugadores</p>
                    </motion.div>
                )}

                {gameState === 'COUNTDOWN' && (
                    <motion.div
                        key={countdown}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 1 }}
                        className="text-8xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                    >
                        {countdown}
                    </motion.div>
                )}

                {gameState === 'CHOOSING' && (
                    <div className="text-4xl font-bold text-white animate-pulse">
                        Eligiendo...
                    </div>
                )}
            </div>

            {/* CÍRCULOS EN LOS DEDOS */}
            {Object.entries(fingers).map(([id, finger]) => {
                const isLoser = gameState === 'RESULT' && id === loserId;
                const isWinner = gameState === 'RESULT' && id !== loserId;
                const colorData = FINGER_COLORS[finger.colorIndex];

                return (
                    <motion.div
                        key={id}
                        initial={{ scale: 0 }}
                        animate={{
                            scale: isLoser ? 1.5 : (isWinner ? 0 : 1),
                            opacity: isWinner ? 0 : 1,
                            // Framer Motion usa transform, así que x/y funcionan bien SI el origen es correcto
                            x: finger.x - 50,
                            y: finger.y - 50
                        }}
                        // CORRECCIÓN IMPORTANTE: top-0 left-0 para forzar el origen en la esquina (0,0)
                        className="absolute top-0 left-0 w-[100px] h-[100px] rounded-full flex items-center justify-center pointer-events-none"
                    >
                        {/* Anillo exterior */}
                        <div className={`absolute inset-0 rounded-full border-4 ${colorData.tw.replace('bg-', 'border-')} opacity-50 animate-ping`} />

                        {/* Círculo sólido interior */}
                        <div className={`w-16 h-16 rounded-full ${colorData.tw} ${colorData.shadow} shadow-[0_0_30px_rgba(0,0,0,0.5)] border-2 border-white flex items-center justify-center`}>
                            {isLoser && <Icon name="Skull" className="text-white animate-bounce" size={24} />}
                        </div>
                    </motion.div>
                );
            })}

            {/* PANTALLA DE RESULTADO FINAL */}
            <AnimatePresence>
                {gameState === 'RESULT' && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-10 left-4 right-4 bg-gray-800/90 backdrop-blur-md rounded-2xl border border-white/10 p-6 text-center pointer-events-auto z-[60]"
                    >
                        <h2 className="text-3xl font-bold text-white mb-2">
                            ¡Perdió el <span className={`uppercase font-black ${fingers[loserId] ? FINGER_COLORS[fingers[loserId].colorIndex].tw.replace('bg-', 'text-') : 'text-white'}`}>{loserColorName}</span>!
                        </h2>
                        <p className="text-gray-300 text-lg mb-6">
                            El dedo seleccionado debe tomar un trago 🥃
                        </p>
                        <Button onClick={onClose} className="w-full bg-white/10 hover:bg-white/20">
                            Cerrar Juego
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Botón de salida */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-gray-800/50 rounded-full text-gray-400 hover:text-white pointer-events-auto z-[60]"
            >
                <Icon name="X" size={24} />
            </button>
        </div>
    );
};

export default FingerRouletteMinigame;