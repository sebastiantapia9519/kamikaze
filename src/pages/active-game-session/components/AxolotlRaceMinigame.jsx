import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../../components/ui/Button';
// 👇 AQUÍ ESTÁ EL CAMBIO CLAVE: Importamos AjoloteMoradoSVG en vez del Dorado
import {
    AjoloteRosaSVG,
    AjoloteAzulSVG,
    AjoloteMoradoSVG,
    AjoloteVerdeSVG,
    AjoloteRojoSVG
} from '../../../components/ui/AjoloteSvgs'; // Ajusta esta ruta si tus SVGs están en otra carpeta

const AxolotlRaceMinigame = ({ onClose, players = [] }) => {
    const [gameState, setGameState] = useState('betting'); // betting, racing, finished
    const [positions, setPositions] = useState([0, 0, 0, 0, 0]);
    const [winner, setWinner] = useState(null);
    const raceInterval = useRef(null);

    // Configuración de los corredores
    const racers = [
        { id: 'rosa', name: 'Rosita', color: 'text-pink-400', Component: AjoloteRosaSVG },
        { id: 'azul', name: 'Azulito', color: 'text-cyan-400', Component: AjoloteAzulSVG },
        { id: 'morado', name: 'Uva', color: 'text-purple-400', Component: AjoloteMoradoSVG }, // 👈 Usamos el nuevo
        { id: 'verde', name: 'Limón', color: 'text-green-400', Component: AjoloteVerdeSVG },
        { id: 'rojo', name: 'Diablito', color: 'text-red-400', Component: AjoloteRojoSVG },
    ];

    // Iniciar carrera
    const startRace = () => {
        setGameState('racing');

        raceInterval.current = setInterval(() => {
            setPositions(prev => {
                const newPositions = [...prev];
                let raceFinished = false;
                let winningIndex = -1;

                // Movemos cada ajolote una distancia aleatoria
                for (let i = 0; i < 5; i++) {
                    // Probabilidad de moverse: 70%
                    if (Math.random() > 0.3) {
                        const speed = Math.random() * 2 + 0.5; // Velocidad variable
                        newPositions[i] += speed;
                    }

                    // Checar si llegó a la meta (100%)
                    if (newPositions[i] >= 90 && !raceFinished) {
                        raceFinished = true;
                        winningIndex = i;
                    }
                }

                if (raceFinished) {
                    clearInterval(raceInterval.current);
                    setWinner(racers[winningIndex]);
                    setGameState('finished');
                }

                return newPositions;
            });
        }, 100);
    };

    // Limpieza al salir
    useEffect(() => {
        return () => clearInterval(raceInterval.current);
    }, []);

    return (
        <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col overflow-hidden">

            {/* ENCABEZADO */}
            <div className="p-4 bg-gray-800 border-b border-white/10 flex justify-between items-center z-10 shadow-md">
                <h2 className="text-xl font-black text-white italic">🏁 CARRERA DE AJOLOTES</h2>
                {gameState === 'finished' && (
                    <Button onClick={onClose} size="sm" className="bg-white/10">Cerrar</Button>
                )}
            </div>

            {/* PISTA DE CARRERAS */}
            <div className="flex-1 relative bg-gray-900 p-4 flex flex-col justify-center space-y-4 overflow-y-auto">

                {/* LÍNEA DE META */}
                <div className="absolute top-0 bottom-0 right-8 w-2 border-r-4 border-dashed border-white/30 z-0" />
                <div className="absolute top-0 bottom-0 right-4 text-xs text-white/30 writing-vertical flex items-center">META</div>

                {racers.map((racer, index) => (
                    <div key={racer.id} className="relative w-full h-12 flex items-center">
                        {/* Carril */}
                        <div className="absolute inset-x-0 h-px bg-white/10 top-1/2" />

                        {/* Corredor */}
                        <motion.div
                            className="relative z-10"
                            animate={{ left: `${Math.min(positions[index], 90)}%` }}
                            transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
                            style={{ position: 'absolute' }}
                        >
                            <div className="flex flex-col items-center transform -translate-x-1/2">
                                <racer.Component size={40} className="filter drop-shadow-lg" />
                                <span className={`text-[10px] font-bold ${racer.color} bg-black/50 px-1 rounded`}>
                                    {racer.name}
                                </span>
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>

            {/* CONTROLES / ESTADO */}
            <div className="p-6 bg-gray-800 border-t border-white/10 z-20">
                <AnimatePresence mode="wait">

                    {/* FASE 1: APUESTAS */}
                    {gameState === 'betting' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                            className="text-center space-y-4"
                        >
                            <p className="text-cyan-300 font-bold text-lg animate-pulse">
                                ¡HAGAN SUS APUESTAS!
                            </p>
                            <p className="text-gray-400 text-sm">
                                Elijan su ajolote favorito. Los perdedores beben.
                            </p>
                            <Button onClick={startRace} className="w-full bg-green-500 hover:bg-green-600 text-white font-black text-xl py-4 shadow-lg shadow-green-900/20">
                                🔫 DISPARAR SALIDA
                            </Button>
                        </motion.div>
                    )}

                    {/* FASE 2: CARRERA EN CURSO */}
                    {gameState === 'racing' && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="text-center"
                        >
                            <p className="text-2xl font-black text-white animate-bounce">
                                ¡CORRAN! 💨
                            </p>
                        </motion.div>
                    )}

                    {/* FASE 3: GANADOR */}
                    {gameState === 'finished' && winner && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            className="text-center space-y-4"
                        >
                            <p className="text-gray-400 uppercase text-xs tracking-widest">El ganador es</p>
                            <h2 className={`text-4xl font-black ${winner.color} drop-shadow-md`}>
                                ¡{winner.name.toUpperCase()}!
                            </h2>
                            <div className="bg-black/30 p-4 rounded-xl border border-white/10">
                                <p className="text-white font-bold mb-1">Castigo:</p>
                                <p className="text-gray-300 text-sm">
                                    Si no apostaste por <span className={winner.color}>{winner.name}</span>, <br />
                                    <span className="text-xl text-white font-black">BEBE 3 TRAGOS 🍺</span>
                                </p>
                            </div>
                            <Button onClick={onClose} className="w-full bg-white/10 hover:bg-white/20 border-2 border-white/50">
                                Continuar
                            </Button>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
};

export default AxolotlRaceMinigame;