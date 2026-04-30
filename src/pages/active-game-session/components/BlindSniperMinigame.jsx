import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

/**
 * Minijuego del Francotirador Ciego.
 * El jugador debe detener el reloj lo más cerca posible de 5.00 segundos.
 * A partir de los 2.00 segundos, el reloj se vuelve invisible (isBlind).
 * 
 * @param {Object} props
 * @param {Function} props.onClose - Función para cerrar el minijuego.
 * @param {Object} props.currentPlayer - Información del jugador actual.
 */
const BlindSniperMinigame = ({ onClose, currentPlayer }) => {
    const [gameState, setGameState] = useState('intro'); // 'intro', 'playing', 'result'
    const [timeDisplay, setTimeDisplay] = useState("0.00");
    const [result, setResult] = useState(null);

    // Refs para la lógica del reloj
    const startTimeRef = useRef(null);
    const requestRef = useRef(null);

    const TARGET_TIME = 5.00;
    const BLIND_AT = 2.00;

    /**
     * Función que actualiza el reloj visualmente en cada frame (loop de animación).
     * Usar requestAnimationFrame es mucho más óptimo que setInterval.
     */
    const updateTime = () => {
        if (!startTimeRef.current) return;
        
        const now = Date.now();
        const elapsed = (now - startTimeRef.current) / 1000;
        setTimeDisplay(elapsed.toFixed(2));
        
        requestRef.current = requestAnimationFrame(updateTime);
    };

    /**
     * Inicia el minijuego y el reloj.
     */
    const startGame = () => {
        setGameState('playing');
        startTimeRef.current = Date.now();
        requestRef.current = requestAnimationFrame(updateTime);
    };

    /**
     * Detiene el reloj, calcula la diferencia con el tiempo objetivo
     * y determina el castigo según el margen de error.
     */
    const stopGame = () => {
        // Detener el loop de animación
        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
        }

        const now = Date.now();
        const finalTime = (now - startTimeRef.current) / 1000;

        const diff = Math.abs(finalTime - TARGET_TIME);

        let sips = 0;
        let message = "";

        // --- 📊 TABLA DE CASTIGOS PERSONALIZADA ---
        if (diff < 0.10) {
            sips = 0;
            message = "¡TIRO PERFECTO! 🎯";
        }
        else if (diff < 0.50) {
            sips = 1; // Menos de medio segundo
            message = "¡Casi! Por poquito.";
        }
        else if (diff < 2.00) {
            sips = 2; // Si se pasa de .5, sube a 2
            message = "Te falló el cálculo...";
        }
        else if (diff < 4.00) {
            sips = 3; // Alrededor de los 3 segundos
            message = "¡Puntería chueca!";
        }
        else if (diff < 5.00) {
            sips = 5; // Ya se está poniendo feo
            message = "Desastroso total 🥴";
        }
        else {
            sips = 6; // Más de 5 segundos de error
            message = "¡¿QUÉ HICISTE?! 💀";
        }

        setResult({
            time: finalTime.toFixed(2),
            diff: diff.toFixed(2),
            sips,
            message
        });
        setGameState('result');
    };

    /**
     * Limpieza: Asegurarse de cancelar el loop si el componente se desmonta.
     */
    useEffect(() => {
        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, []);

    const currentTimeFloat = parseFloat(timeDisplay);
    // Condición de "ceguera": Cuando el tiempo supera BLIND_AT
    const isBlind = currentTimeFloat > BLIND_AT && gameState === 'playing';

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
            <div className="max-w-md w-full text-center space-y-8">

                {/* --- INTRO --- */}
                {gameState === 'intro' && (
                    <motion.div
                        initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                        className="bg-gray-900 border border-gray-700 p-8 rounded-2xl shadow-2xl"
                    >
                        <Icon name="Target" size={64} className="text-cyan-400 mx-auto mb-6" />
                        <div className="mb-4">
                            <span className="text-gray-400 text-sm uppercase tracking-widest">Tirador:</span>
                            <h2 className="text-3xl font-black text-white mt-1">{currentPlayer?.name || "Jugador"}</h2>
                        </div>
                        <p className="text-gray-300 text-lg mb-8">
                            Detén el reloj en <span className="text-cyan-400 font-bold text-2xl">5.00s</span>.
                            <br /><br />
                            <span className="text-sm text-gray-400">
                                0.5s error = 1 trago<br />
                                +0.5s error = 2 tragos<br />
                                +5s error = 💀
                            </span>
                        </p>
                        <Button onClick={startGame} size="lg" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-4">
                            INICIAR RELOJ
                        </Button>
                    </motion.div>
                )}

                {/* --- JUEGO --- */}
                {gameState === 'playing' && (
                    <div className="space-y-12">
                        <h2 className="text-2xl text-gray-400 font-light tracking-widest">OBJETIVO: 5.00s</h2>

                        <div className="relative h-40 flex items-center justify-center">
                            <div className={`font-mono text-8xl font-black tracking-tighter tabular-nums transition-opacity duration-300 ${isBlind ? 'opacity-0 blur-xl' : 'opacity-100 text-white'}`}>
                                {timeDisplay}
                            </div>

                            {isBlind && (
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <Icon name="EyeOff" size={80} className="text-gray-700" />
                                </motion.div>
                            )}
                        </div>

                        <Button
                            onClick={stopGame}
                            className="w-40 h-40 rounded-full bg-red-600 hover:bg-red-500 border-8 border-red-800 shadow-[0_0_50px_rgba(220,38,38,0.5)] active:scale-95 transition-all mx-auto flex items-center justify-center"
                        >
                            <span className="text-2xl font-black text-white">¡STOP!</span>
                        </Button>
                    </div>
                )}

                {/* --- RESULTADO --- */}
                {gameState === 'result' && (
                    <motion.div
                        initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                        className="bg-gray-900 border border-gray-700 p-8 rounded-2xl"
                    >
                        <h3 className="text-gray-400 uppercase tracking-widest text-sm mb-2">Tu tiempo fue:</h3>
                        <div className={`font-mono text-6xl font-black mb-6 ${result.sips === 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {result.time}s
                        </div>

                        <div className="bg-gray-800/50 p-4 rounded-xl mb-8">
                            <h2 className="text-2xl font-bold text-white mb-2">{result.message}</h2>
                            <p className="text-gray-300 mb-4">
                                Diferencia: <span className="font-mono font-bold text-white">{result.diff}s</span>
                            </p>

                            {result.sips > 0 ? (
                                <div className="border-t border-gray-700 pt-4">
                                    <p className="text-sm text-gray-400 mb-1">Tu castigo:</p>
                                    <p className="text-red-400 font-black text-4xl animate-pulse">
                                        🍺 {result.sips} {result.sips === 1 ? 'TRAGO' : 'TRAGOS'}
                                    </p>
                                </div>
                            ) : (
                                <div className="border-t border-gray-700 pt-4">
                                    <p className="text-green-400 font-bold text-xl">
                                        🏆 ¡PUNTERÍA LÁSER!
                                    </p>
                                    <p className="text-sm text-gray-400">Reparte 5 tragos.</p>
                                </div>
                            )}
                        </div>

                        <Button onClick={onClose} size="lg" className="w-full">
                            Continuar
                        </Button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default BlindSniperMinigame;