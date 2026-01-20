import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChampagneShakeMinigame = ({ onClose }) => {
    const [pressure, setPressure] = useState(0);
    const [exploded, setExploded] = useState(false);
    const [shakeCount, setShakeCount] = useState(0);
    const [threshold, setThreshold] = useState(0);
    const controls = useAnimation();

    // Referencias para la lógica de movimiento
    const lastX = useRef(0);
    const lastY = useRef(0);
    const lastZ = useRef(0);
    const lastUpdate = useRef(0);

    // Inicializar el límite de explosión aleatorio (entre 30 y 80 "agitadas")
    useEffect(() => {
        setThreshold(Math.floor(Math.random() * 50) + 30);
    }, []);

    // --- DETECCIÓN DE AGITACIÓN (ACELERÓMETRO) ---
    useEffect(() => {
        const handleMotion = (event) => {
            if (exploded) return;

            const current = event.accelerationIncludingGravity;
            if (!current) return;

            const currentTime = new Date().getTime();
            if ((currentTime - lastUpdate.current) > 100) {
                const diffTime = currentTime - lastUpdate.current;
                lastUpdate.current = currentTime;

                const speed = Math.abs(current.x + current.y + current.z - lastX.current - lastY.current - lastZ.current) / diffTime * 10000;

                if (speed > 800) { // Sensibilidad
                    increasePressure();
                }

                lastX.current = current.x;
                lastY.current = current.y;
                lastZ.current = current.z;
            }
        };

        window.addEventListener('devicemotion', handleMotion);
        return () => window.removeEventListener('devicemotion', handleMotion);
    }, [exploded, pressure, threshold]);

    // --- LÓGICA DE PRESIÓN ---
    const increasePressure = () => {
        if (exploded) return;

        const newCount = shakeCount + 1;
        setShakeCount(newCount);

        // Animación visual de la botella
        controls.start({
            rotate: [0, -15, 15, -15, 15, 0],
            transition: { duration: 0.2 }
        });

        // Calcular porcentaje visual (engañoso para generar tensión)
        // Nunca mostramos que está al 100% hasta que explota
        const visualPressure = Math.min((newCount / threshold) * 100, 95);
        setPressure(visualPressure);

        // ¡BOOM!
        if (newCount >= threshold) {
            setExploded(true);
            setPressure(100);
            if (navigator.vibrate) navigator.vibrate(1000); // Vibración larga
        } else {
            if (navigator.vibrate) navigator.vibrate(50); // Vibración corta
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 p-4 overflow-hidden">
            {/* ENCABEZADO */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Icon name="Activity" className="text-yellow-400" /> Agita la Champaña
                </h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white bg-black/20 p-2 rounded-full">
                    <Icon name="X" size={24} />
                </button>
            </div>

            {/* ZONA DE JUEGO */}
            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm">

                {!exploded ? (
                    <>
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-white mb-2 animate-pulse">
                                ¡AGÍTALO FUERTE!
                            </h3>
                            <p className="text-gray-400">Pásalo rápido antes de que explote.</p>
                        </div>

                        {/* BOTELLA ANIMADA */}
                        <motion.div
                            animate={controls}
                            className="relative w-40 h-auto cursor-pointer"
                            onClick={increasePressure} // Fallback click
                        >
                            {/* SVG BOTELLA SIMPLE */}
                            <svg viewBox="0 0 100 240" className="w-full h-full drop-shadow-2xl">
                                <path d="M30,0 L70,0 L70,20 L80,30 L80,80 L90,100 L90,230 Q90,240 80,240 L20,240 Q10,240 10,230 L10,100 L20,80 L20,30 L30,20 Z" fill="#1F2937" stroke="#FBBF24" strokeWidth="4" />
                                {/* ETIQUETA */}
                                <rect x="20" y="120" width="60" height="60" fill="#FBBF24" rx="5" />
                                <text x="50" y="155" textAnchor="middle" fill="#000" fontSize="20" fontWeight="bold">BOOM</text>
                                {/* CORCHO */}
                                <rect x="30" y="-10" width="40" height="20" fill="#A16207" rx="2" />
                            </svg>

                            {/* BURBUJAS DE PRESIÓN */}
                            <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-50 pointer-events-none">
                                <div
                                    className="w-full bg-yellow-500/30 transition-all duration-300"
                                    style={{ height: `${pressure}%` }}
                                ></div>
                            </div>
                        </motion.div>

                        <p className="mt-8 text-xs text-gray-500 uppercase tracking-widest">
                            Presión acumulada
                        </p>
                        <div className="w-64 h-4 bg-gray-800 rounded-full mt-2 overflow-hidden border border-white/10">
                            <div
                                className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-300"
                                style={{ width: `${pressure}%` }}
                            ></div>
                        </div>

                        {/* Botón táctil por si no funciona el sensor */}
                        <button
                            className="mt-8 bg-white/10 active:bg-white/30 text-white px-8 py-4 rounded-full font-bold touch-manipulation"
                            onClick={increasePressure}
                        >
                            ¿No vibra? ¡Toca aquí rápido!
                        </button>
                    </>
                ) : (
                    /* EXPLOSIÓN / RESULTADO */
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center"
                    >
                        <div className="text-8xl mb-4">💥🍾💦</div>
                        <h2 className="text-4xl font-black text-red-500 mb-2">¡EXPLOTÓ!</h2>
                        <p className="text-2xl text-white font-bold mb-6">
                            El que lo tenga en la mano...
                        </p>
                        <div className="bg-red-500/20 border border-red-500 p-6 rounded-2xl animate-bounce">
                            <span className="text-3xl font-black text-white">5 TRAGOS</span>
                            <span className="block text-sm text-red-300 mt-1 uppercase tracking-wide">Tragos en Castigo</span>
                        </div>

                        <Button onClick={() => {
                            setExploded(false);
                            setShakeCount(0);
                            setPressure(0);
                            setThreshold(Math.floor(Math.random() * 50) + 30);
                        }} className="mt-8 w-full">
                            Jugar otra vez
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ChampagneShakeMinigame;