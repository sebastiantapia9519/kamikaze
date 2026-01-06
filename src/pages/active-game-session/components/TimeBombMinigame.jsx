import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TimeBombMinigame = ({ onClose, currentPlayer }) => {
    const [gameState, setGameState] = useState('intro'); // 'intro', 'ticking', 'exploded', 'defused'
    const [timeLeft, setTimeLeft] = useState(15.0);
    const [feedback, setFeedback] = useState('');
    const [cutWires, setCutWires] = useState([]); // ✅ Nuevo: Lista de cables ya cortados

    // Configuración de cables (Aleatoria cada vez)
    const wires = useMemo(() => {
        const availableColors = [
            { css: 'bg-green-500', shadow: 'shadow-green-500/50', name: 'Verde' },
            { css: 'bg-red-500', shadow: 'shadow-red-500/50', name: 'Rojo' },
            { css: 'bg-yellow-400', shadow: 'shadow-yellow-400/50', name: 'Amarillo' },
            { css: 'bg-blue-500', shadow: 'shadow-blue-500/50', name: 'Azul' }
        ];

        // Efectos: 1 Desactiva (Gana), 1 Explota (Pierde), 2 Trampas (-5 seg)
        const possibleEffects = ['defuse', 'explode', 'speed', 'speed'];
        const shuffledEffects = [...possibleEffects].sort(() => Math.random() - 0.5);

        return availableColors.map((color, index) => ({
            ...color,
            type: shuffledEffects[index],
            id: index
        }));
    }, []);

    // Temporizador
    useEffect(() => {
        if (gameState !== 'ticking') return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                const nextTime = prev - 0.1;
                // Vibración cardíaca (más rápida si queda poco tiempo)
                if (nextTime < 5 && nextTime > 0 && Math.floor(nextTime) < Math.floor(prev)) {
                    if (navigator.vibrate) navigator.vibrate(200);
                }
                if (nextTime <= 0) {
                    clearInterval(timer);
                    handleExplosion("¡SE ACABÓ EL TIEMPO!");
                    return 0;
                }
                return nextTime;
            });
        }, 100);

        return () => clearInterval(timer);
    }, [gameState]);

    const handleExplosion = (reason) => {
        setGameState('exploded');
        setFeedback(reason);
        if (navigator.vibrate) navigator.vibrate([500, 100, 500]);
    };

    const handleCutWire = (wire) => {
        if (gameState !== 'ticking') return;
        if (cutWires.includes(wire.id)) return; // Si ya está cortado, no hacer nada

        // Marcamos este cable como cortado visualmente
        setCutWires(prev => [...prev, wire.id]);

        if (wire.type === 'defuse') {
            setGameState('defused');
            setFeedback("¡Bomba Desactivada!");
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        }
        else if (wire.type === 'explode') {
            setTimeLeft(0);
            handleExplosion("¡CABLE EQUIVOCADO!");
        }
        else if (wire.type === 'speed') {
            // Trampa: Resta tiempo pero el juego sigue con los otros cables
            setTimeLeft((prev) => Math.max(0, prev - 5));
            setFeedback("¡TRAMPA! -5 SEGUNDOS");
            if (navigator.vibrate) navigator.vibrate(300);
        }
    };

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
            <div className="max-w-md w-full text-center space-y-6">

                {/* --- INTRO --- */}
                {gameState === 'intro' && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-gray-900 border border-gray-700 p-8 rounded-2xl shadow-2xl"
                    >
                        <Icon name="Bomb" size={64} className="text-red-500 mx-auto mb-4 animate-pulse" />

                        {/* ✅ NOMBRE DEL JUGADOR AQUI */}
                        <div className="mb-2">
                            <span className="text-gray-400 text-sm uppercase tracking-widest">Misión para:</span>
                            <h2 className="text-4xl font-black text-yellow-400 mt-1">{currentPlayer?.name}</h2>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-4">¡CÓRTALE!</h3>

                        <p className="text-gray-300 text-lg mb-8">
                            Corta el cable correcto para desactivar la bomba.
                            <br />
                            <span className="text-red-400 text-sm">⚠️ Cuidado: Algunos cables aceleran el tiempo.</span>
                        </p>
                        <Button onClick={() => setGameState('ticking')} size="lg" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xl py-4">
                            ¡ESTOY LISTO!
                        </Button>
                    </motion.div>
                )}

                {/* --- JUEGO --- */}
                {gameState !== 'intro' && (
                    <>
                        {/* RELOJ */}
                        <div className={`relative p-6 rounded-2xl border-4 transition-colors duration-300 ${gameState === 'exploded' ? 'border-red-600 bg-red-900/50' : gameState === 'defused' ? 'border-green-500 bg-green-900/50' : 'border-gray-700 bg-gray-900'}`}>
                            <div className="font-mono text-7xl font-black tracking-widest text-white tabular-nums drop-shadow-[0_0_15px_rgba(255,0,0,0.6)]">
                                {timeLeft.toFixed(1)}
                            </div>
                            <div className={`mt-2 font-bold text-xl uppercase h-8 ${gameState === 'exploded' ? 'text-red-400' : gameState === 'defused' ? 'text-green-400' : 'text-yellow-400'}`}>
                                {feedback}
                            </div>
                        </div>

                        {/* ZONA DE CABLES */}
                        {gameState === 'ticking' ? (
                            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 space-y-6 relative">
                                {/* Fondo técnico (opcional) */}
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 rounded-xl pointer-events-none"></div>

                                {wires.map((wire) => {
                                    const isCut = cutWires.includes(wire.id);

                                    return (
                                        <div key={wire.id} className="relative h-14 flex items-center justify-between">
                                            {/* Terminal Izquierda */}
                                            <div className="w-8 h-8 bg-gray-600 rounded-full border-2 border-gray-500 z-10 shadow-lg"></div>

                                            {/* EL CABLE (Botón Interactivo) */}
                                            <button
                                                onClick={() => handleCutWire(wire)}
                                                disabled={isCut} // ✅ Se desactiva si está cortado
                                                className="absolute left-4 right-4 h-full flex items-center justify-center group outline-none focus:outline-none"
                                            >
                                                {isCut ? (
                                                    // --- CABLE CORTADO (Dos pedazos separados) ---
                                                    <>
                                                        <div className={`h-4 w-[45%] absolute left-0 rounded-l-full ${wire.css} opacity-60 shadow-none`}></div>
                                                        <div className={`h-4 w-[45%] absolute right-0 rounded-r-full ${wire.css} opacity-60 shadow-none`}></div>
                                                        {/* Icono de corte en medio */}
                                                        <div className="z-20 text-gray-500 rotate-45 transform scale-125">✂️</div>
                                                    </>
                                                ) : (
                                                    // --- CABLE INTACTO ---
                                                    <div className={`h-6 w-full rounded-full transition-transform transform group-active:scale-95 ${wire.css} ${wire.shadow} shadow-lg flex items-center justify-center`}>
                                                        {/* Brillo del cable */}
                                                        <div className="w-full h-1 bg-white/30 absolute top-1 rounded-full"></div>
                                                        <Icon name="Scissors" size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                                                    </div>
                                                )}
                                            </button>

                                            {/* Terminal Derecha */}
                                            <div className="w-8 h-8 bg-gray-600 rounded-full border-2 border-gray-500 z-10 shadow-lg"></div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            /* RESULTADO FINAL */
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div className="bg-gray-800 p-6 rounded-lg border border-gray-600">
                                    {gameState === 'exploded' ? (
                                        <>
                                            <h3 className="text-4xl font-black text-red-500 mb-2">💀 BOOM</h3>
                                            <p className="text-gray-300 text-lg">Te toca beber <br /><span className="text-2xl font-bold text-white">TODO EL VASO</span></p>
                                        </>
                                    ) : (
                                        <>
                                            <h3 className="text-4xl font-black text-green-500 mb-2">🏆 SALVADO</h3>
                                            <p className="text-gray-300 text-lg">Eres un genio. <br />Reparte <span className="text-2xl font-bold text-white">3 TRAGOS</span>.</p>
                                        </>
                                    )}
                                </div>
                                <Button onClick={onClose} size="lg" className="w-full animate-pulse-glow">
                                    Continuar Juego
                                </Button>
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default TimeBombMinigame;