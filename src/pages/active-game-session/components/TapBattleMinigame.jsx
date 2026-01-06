import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';

const TapBattleMinigame = ({ onClose, players }) => {
    const [score, setScore] = useState(50); // 0 = Gana Rojo (Arriba), 100 = Gana Azul (Abajo)
    const [gameState, setGameState] = useState('intro'); // intro, playing, winner
    const [winner, setWinner] = useState(null);

    // Selección de jugadores al azar para la batalla
    const [fighter1, setFighter1] = useState(players[0]?.name || 'P1');
    const [fighter2, setFighter2] = useState(players[1]?.name || 'P2');

    useEffect(() => {
        if (players.length >= 2) {
            // Barajar rápido para elegir 2 peleadores al azar
            const shuffled = [...players].sort(() => 0.5 - Math.random());
            setFighter1(shuffled[0].name);
            setFighter2(shuffled[1].name);
        }
    }, [players]);

    const handleTap = (player) => {
        if (gameState !== 'playing') return;

        setScore(prev => {
            let newScore = prev;
            if (player === 'red') newScore -= 5; // Rojo baja el score
            if (player === 'blue') newScore += 5; // Azul sube el score

            // Verificar victoria
            if (newScore <= 0) endGame('red');
            if (newScore >= 100) endGame('blue');

            return Math.max(0, Math.min(100, newScore));
        });
    };

    const endGame = (winnerColor) => {
        setGameState('winner');
        setWinner(winnerColor === 'red' ? fighter1 : fighter2);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col overflow-hidden">

            {/* --- FASE DE JUEGO --- */}

            {/* ZONA ROJA (ARRIBA) */}
            <div
                className="flex-1 bg-red-600 active:bg-red-500 transition-colors flex flex-col items-center justify-center relative touch-none select-none"
                onClick={() => handleTap('red')}
            >
                <div className="transform rotate-180 text-center pointer-events-none">
                    <h2 className="text-4xl font-black text-red-900 uppercase">{fighter1}</h2>
                    <p className="text-white font-bold opacity-80">¡TOCA RÁPIDO!</p>
                </div>
            </div>

            {/* BARRA DE PROGRESO CENTRAL */}
            <div className="h-12 bg-gray-800 relative flex items-center border-y-4 border-white z-10">
                <motion.div
                    className="absolute top-0 bottom-0 bg-gradient-to-r from-red-500 via-white to-blue-500 w-full opacity-50"
                />
                {/* Indicador de fuerza */}
                <motion.div
                    className="absolute h-16 w-4 bg-white border-2 border-black shadow-[0_0_20px_white]"
                    style={{ left: `${score}%`, x: '-50%' }}
                    animate={{ left: `${score}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
            </div>

            {/* ZONA AZUL (ABAJO) */}
            <div
                className="flex-1 bg-blue-600 active:bg-blue-500 transition-colors flex flex-col items-center justify-center touch-none select-none"
                onClick={() => handleTap('blue')}
            >
                <div className="text-center pointer-events-none">
                    <h2 className="text-4xl font-black text-blue-900 uppercase">{fighter2}</h2>
                    <p className="text-white font-bold opacity-80">¡TOCA RÁPIDO!</p>
                </div>
            </div>

            {/* --- MODAL INTRO --- */}
            {gameState === 'intro' && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                    <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="bg-white p-8 rounded-2xl text-center max-w-xs border-4 border-yellow-400"
                    >
                        <h2 className="text-3xl font-black text-black mb-4">🥊 PELEA</h2>
                        <div className="flex justify-between items-center mb-6 font-bold text-xl">
                            <span className="text-red-600">{fighter1}</span>
                            <span className="text-2xl">VS</span>
                            <span className="text-blue-600">{fighter2}</span>
                        </div>
                        <Button onClick={() => setGameState('playing')} size="lg" className="w-full bg-black text-white hover:bg-gray-800">
                            ¡FIGHT!
                        </Button>
                    </motion.div>
                </div>
            )}

            {/* --- MODAL GANADOR --- */}
            {gameState === 'winner' && (
                <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="text-center space-y-6 p-6"
                    >
                        <h1 className="text-6xl font-black text-yellow-400 mb-2">KO!</h1>
                        <h2 className="text-4xl font-bold text-white">GANADOR:</h2>
                        <div className="bg-white text-black p-4 rounded-xl text-3xl font-black transform rotate-2">
                            {winner}
                        </div>
                        <div className="pt-8">
                            <p className="text-gray-400 text-sm uppercase">El perdedor bebe:</p>
                            <p className="text-white text-2xl font-bold">3 TRAGOS</p>
                        </div>
                        <Button onClick={onClose} size="lg" className="w-full mt-8">
                            Continuar
                        </Button>
                    </motion.div>
                </div>
            )}
        </div>
    );
};
//Aqui termina el componente

export default TapBattleMinigame;