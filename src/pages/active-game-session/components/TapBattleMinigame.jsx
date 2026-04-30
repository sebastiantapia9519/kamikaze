import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';

const TapBattleMinigame = ({ onClose, players }) => {
    const [score, setScore] = useState(50);
    const [gameState, setGameState] = useState('intro');
    const [winner, setWinner] = useState(null);
    const [fighter1, setFighter1] = useState(players[0]?.name || 'P1');
    const [fighter2, setFighter2] = useState(players[1]?.name || 'P2');

    // FIX: Usamos ref para acceder al score actual sin stale closure
    const scoreRef = useRef(50);

    useEffect(() => {
        if (players.length >= 2) {
            const shuffled = [...players].sort(() => 0.5 - Math.random());
            setFighter1(shuffled[0].name);
            setFighter2(shuffled[1].name);
        }
    }, [players]);

    const handleTap = (player) => {
        if (gameState !== 'playing') return;

        setScore(prev => {
            const newScore = player === 'red'
                ? Math.max(0, prev - 5)
                : Math.min(100, prev + 5);

            // FIX: Actualizamos la ref antes de verificar victoria
            scoreRef.current = newScore;

            // FIX: Verificamos victoria directamente con newScore, no con estado
            if (newScore <= 0) {
                setGameState('winner');
                setWinner(fighter1); // red gana
            } else if (newScore >= 100) {
                setGameState('winner');
                setWinner(fighter2); // blue gana
            }

            return newScore;
        });
    };

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col overflow-hidden select-none">

            {/* ZONA ROJA (ARRIBA) */}
            <div
                className="flex-1 active:brightness-125 transition-all flex flex-col items-center justify-center touch-none"
                style={{ backgroundColor: '#dc2626' }}
                onClick={() => handleTap('red')}
            >
                <div className="transform rotate-180 text-center pointer-events-none">
                    <h2 className="text-5xl font-black text-red-900 uppercase tracking-wider">{fighter1}</h2>
                    <p className="text-white font-bold text-xl opacity-80 mt-2">¡TOCA RÁPIDO!</p>
                    <p className="text-red-200 text-sm opacity-60 mt-1">🔴 Zona Roja</p>
                </div>
            </div>

            {/* BARRA DE PROGRESO CENTRAL */}
            <div className="h-14 bg-gray-900 relative flex items-center border-y-4 border-white z-10">
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <span className="text-white font-black text-sm tracking-widest uppercase bg-black/50 px-3 py-1 rounded-full">
                        VS
                    </span>
                </div>
                <motion.div
                    className="absolute h-full w-2 bg-white shadow-[0_0_20px_white] z-20"
                    animate={{ left: `${score}%` }}
                    style={{ x: '-50%' }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
                {/* Fondo degradado */}
                <div
                    className="absolute inset-0 opacity-60"
                    style={{ background: 'linear-gradient(to right, #ef4444, #1d4ed8)' }}
                />
            </div>

            {/* ZONA AZUL (ABAJO) */}
            <div
                className="flex-1 active:brightness-125 transition-all flex flex-col items-center justify-center touch-none"
                style={{ backgroundColor: '#2563eb' }}
                onClick={() => handleTap('blue')}
            >
                <div className="text-center pointer-events-none">
                    <h2 className="text-5xl font-black text-blue-900 uppercase tracking-wider">{fighter2}</h2>
                    <p className="text-white font-bold text-xl opacity-80 mt-2">¡TOCA RÁPIDO!</p>
                    <p className="text-blue-200 text-sm opacity-60 mt-1">🔵 Zona Azul</p>
                </div>
            </div>

            {/* MODAL INTRO */}
            {gameState === 'intro' && (
                <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ scale: 0, rotate: -5 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="bg-white p-8 rounded-3xl text-center w-full max-w-sm border-4 border-yellow-400 shadow-2xl"
                    >
                        <div className="text-6xl mb-4">🥊</div>
                        <h2 className="text-4xl font-black text-black mb-2">¡BATTLE!</h2>
                        <p className="text-gray-500 text-sm mb-6">El primero en llegar al extremo gana</p>
                        <div className="flex justify-between items-center mb-8 font-black text-2xl px-4">
                            <div className="text-red-600 text-center">
                                <div>{fighter1}</div>
                                <div className="text-xs font-normal text-gray-400 mt-1">Zona Roja ↑</div>
                            </div>
                            <div className="text-3xl">⚡</div>
                            <div className="text-blue-600 text-center">
                                <div>{fighter2}</div>
                                <div className="text-xs font-normal text-gray-400 mt-1">Zona Azul ↓</div>
                            </div>
                        </div>
                        <Button
                            onClick={() => setGameState('playing')}
                            className="w-full bg-black text-white hover:bg-gray-800 py-4 text-xl font-black rounded-2xl"
                        >
                            ¡PELEA!
                        </Button>
                    </motion.div>
                </div>
            )}

            {/* MODAL GANADOR */}
            {gameState === 'winner' && winner && (
                <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ scale: 0.3, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 250, damping: 18 }}
                        className="text-center space-y-6"
                    >
                        <motion.div
                            animate={{ rotate: [0, -10, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 0.5 }}
                            className="text-8xl"
                        >
                            🏆
                        </motion.div>
                        <div>
                            <h1 className="text-7xl font-black text-yellow-400 mb-2 drop-shadow-lg">KO!</h1>
                            <h2 className="text-3xl font-bold text-white mb-4">GANADOR:</h2>
                            <div className="bg-white text-black px-8 py-4 rounded-2xl text-4xl font-black shadow-2xl transform -rotate-1">
                                {winner}
                            </div>
                        </div>

                        <div className="bg-red-500/20 border border-red-500/40 p-4 rounded-2xl">
                            <p className="text-gray-300 text-sm uppercase tracking-widest mb-1">El perdedor bebe:</p>
                            <p className="text-white text-3xl font-black">
                                {winner === fighter1 ? fighter2 : fighter1} → 3 TRAGOS 🍺
                            </p>
                        </div>

                        <Button
                            onClick={onClose}
                            className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-xl rounded-2xl border border-white/20"
                        >
                            Continuar partida
                        </Button>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default TapBattleMinigame;