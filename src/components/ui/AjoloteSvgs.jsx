import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

// --- COMPONENTE VISUAL DE AJOLOTE (SVG) ---
const AxolotlCharacter = ({ color, isWinner }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        {/* Cuerpo */}
        <path d="M30,60 Q20,50 30,40 Q40,30 60,30 Q80,30 90,50 Q80,70 60,70 Q40,70 30,60" fill={color} />
        {/* Cola */}
        <path d="M30,50 Q10,50 5,55 Q10,60 30,60" fill={color} />
        {/* Branquias (Detalle clave) */}
        <path d="M60,35 Q50,20 55,15" fill="none" stroke="#F472B6" strokeWidth="3" strokeLinecap="round" />
        <path d="M55,35 Q45,25 45,15" fill="none" stroke="#F472B6" strokeWidth="3" strokeLinecap="round" />
        <path d="M50,40 Q40,40 35,35" fill="none" stroke="#F472B6" strokeWidth="3" strokeLinecap="round" />
        {/* Ojos */}
        <circle cx="75" cy="45" r="3" fill="black" />
        <circle cx="55" cy="45" r="3" fill="black" />
        {/* Boca */}
        <path d="M60,55 Q65,60 70,55" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" />
        {/* Destellos si gana */}
        {isWinner && (
            <circle cx="85" cy="35" r="2" fill="white" className="animate-ping" />
        )}
    </svg>
);

// --- CONFIGURACIÓN DE LOS CORREDORES (AHORA SON 5) ---
const AXOLOTLS = [
    { id: 'pink', name: 'Rosita', hex: '#F472B6', bg: 'bg-pink-500', border: 'border-pink-400' },
    { id: 'cyan', name: 'Azulito', hex: '#22D3EE', bg: 'bg-cyan-500', border: 'border-cyan-400' },
    { id: 'green', name: 'Limón', hex: '#A3E635', bg: 'bg-lime-500', border: 'border-lime-400' },
    { id: 'purple', name: 'Uva', hex: '#C084FC', bg: 'bg-purple-500', border: 'border-purple-400' },
    { id: 'red', name: 'Rojito', hex: '#F87171', bg: 'bg-red-500', border: 'border-red-400' }, // <--- AGREGADO
];

const AxolotlRaceMinigame = ({ players, onClose }) => {
    // --- ESTADOS DEL JUEGO ---
    const [phase, setPhase] = useState('BETTING'); // 'BETTING', 'RACING', 'RESULTS'

    // --- LÓGICA DE APUESTAS ---
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [bets, setBets] = useState({});
    const [currentBetAmount, setCurrentBetAmount] = useState(1);
    const [selectedAxolotlId, setSelectedAxolotlId] = useState(null);

    // --- LÓGICA DE CARRERA ---
    // Inicializamos posiciones para los 5 ajolotes (incluyendo red)
    const [positions, setPositions] = useState({ pink: 0, cyan: 0, green: 0, purple: 0, red: 0 });
    const [winner, setWinner] = useState(null);
    const raceIntervalRef = useRef(null);

    // --- 1. CONTROL DE APUESTAS ---
    const handlePlaceBet = () => {
        if (!selectedAxolotlId) return;

        const currentPlayer = players[currentPlayerIndex];

        setBets(prev => ({
            ...prev,
            [currentPlayer.id]: {
                axolotlId: selectedAxolotlId,
                amount: currentBetAmount
            }
        }));

        if (currentPlayerIndex < players.length - 1) {
            setCurrentPlayerIndex(prev => prev + 1);
            setSelectedAxolotlId(null);
            setCurrentBetAmount(1);
        } else {
            setPhase('RACING');
        }
    };

    // --- 2. LÓGICA DE CARRERA (LOOP) ---
    useEffect(() => {
        if (phase === 'RACING') {
            raceIntervalRef.current = setInterval(() => {
                setPositions(prev => {
                    const newPositions = { ...prev };
                    let raceFinished = false;
                    let winningAxolotl = null;

                    AXOLOTLS.forEach(axolotl => {
                        // Probabilidad de moverse
                        const move = Math.random() > 0.2 ? Math.random() * 2.5 : 0;

                        // Aseguramos que exista la posición antes de sumar (por si acaso)
                        if (newPositions[axolotl.id] === undefined) newPositions[axolotl.id] = 0;

                        newPositions[axolotl.id] += move;

                        if (newPositions[axolotl.id] >= 92 && !raceFinished) {
                            raceFinished = true;
                            winningAxolotl = axolotl.id;
                        }
                    });

                    if (raceFinished) {
                        clearInterval(raceIntervalRef.current);
                        setWinner(winningAxolotl);
                        setTimeout(() => setPhase('RESULTS'), 2000);
                    }

                    return newPositions;
                });
            }, 50);
        }

        return () => clearInterval(raceIntervalRef.current);
    }, [phase]);

    // --- RENDERIZADO ---

    // 1. PANTALLA DE APUESTAS
    if (phase === 'BETTING') {
        const player = players[currentPlayerIndex];
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    key={player.id}
                    className="w-full max-w-lg bg-gray-900 rounded-2xl border border-white/10 p-6 flex flex-col gap-6"
                >
                    <div className="text-center">
                        <span className="text-gray-400 text-sm uppercase tracking-widest">Fase de Apuestas</span>
                        <h2 className="text-3xl font-bold text-white mt-1">
                            Turno de <span className="text-yellow-400">{player.name}</span>
                        </h2>
                        <p className="text-gray-400 text-sm mt-2">¿Quién es tu gallo?</p>
                    </div>

                    {/* SELECCIÓN DE AJOLOTE (Grid ajustado para 5 items) */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {AXOLOTLS.map(ax => (
                            <button
                                key={ax.id}
                                onClick={() => setSelectedAxolotlId(ax.id)}
                                className={`p-2 rounded-xl border-2 transition-all flex flex-col items-center gap-2 relative overflow-hidden ${selectedAxolotlId === ax.id
                                        ? `border-${ax.border.split('-')[1]}-400 bg-white/10 scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]`
                                        : 'border-white/5 bg-gray-800/50 hover:bg-gray-800'
                                    }`}
                            >
                                <div className="w-16 h-16 relative z-10">
                                    <AxolotlCharacter color={ax.hex} />
                                </div>
                                <span className={`font-bold relative z-10 ${selectedAxolotlId === ax.id ? 'text-white' : 'text-gray-400'}`}>
                                    {ax.name}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* CANTIDAD DE TRAGOS (MAX 30) */}
                    <div className="bg-gray-800/50 p-4 rounded-xl flex items-center justify-between border border-white/5">
                        <span className="text-gray-300 font-bold">Apuesta (Tragos):</span>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setCurrentBetAmount(Math.max(1, currentBetAmount - 1))}
                                className="w-12 h-12 rounded-xl bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center transition-colors"
                            >
                                <Icon name="Minus" size={20} />
                            </button>
                            <span className="text-3xl font-black text-white w-12 text-center">{currentBetAmount}</span>
                            <button
                                onClick={() => setCurrentBetAmount(Math.min(30, currentBetAmount + 1))}
                                className="w-12 h-12 rounded-xl bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center transition-colors"
                            >
                                <Icon name="Plus" size={20} />
                            </button>
                        </div>
                    </div>

                    <Button
                        onClick={handlePlaceBet}
                        disabled={!selectedAxolotlId}
                        className={`w-full py-4 text-lg font-bold shadow-lg ${!selectedAxolotlId ? 'opacity-50 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400'}`}
                    >
                        {currentPlayerIndex < players.length - 1 ? 'Siguiente Jugador' : '¡ARRANCAR CARRERA! 🏁'}
                    </Button>
                </motion.div>
            </div>
        );
    }

    // 2. PANTALLA DE CARRERA Y RESULTADOS
    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-gray-900 overflow-hidden">
            {/* HEADER */}
            <div className="p-4 bg-gray-800/50 border-b border-white/10 flex justify-between items-center relative z-20 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Icon name="Trophy" className="text-yellow-400" /> Gran Carrera
                </h2>
                {phase === 'RESULTS' && (
                    <button onClick={onClose} className="text-gray-400 hover:text-white bg-white/5 p-2 rounded-full">
                        <Icon name="X" size={24} />
                    </button>
                )}
            </div>

            {/* PISTA DE CARRERA */}
            <div className="flex-1 relative flex flex-col justify-center gap-4 p-2 bg-gray-900 overflow-y-auto">
                {/* LINEA DE META */}
                <div className="absolute top-0 bottom-0 right-[8%] w-1 bg-white/20 z-0 flex flex-col justify-center items-center">
                    <div className="h-full w-4 border-r-2 border-dashed border-white/30"></div>
                </div>

                {AXOLOTLS.map((axolotl) => (
                    <div key={axolotl.id} className="relative w-full h-20 flex items-center border-b border-white/5 last:border-0 shrink-0">
                        {/* Ajolote Corriendo */}
                        <motion.div
                            className="absolute left-0 z-10 flex flex-col items-center"
                            style={{ left: `${Math.min(positions[axolotl.id] || 0, 90)}%` }}
                            animate={phase === 'RESULTS' && winner === axolotl.id ? { scale: [1, 1.1, 1], x: [0, 10, 0] } : {}}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="w-20 h-20 relative">
                                <AxolotlCharacter color={axolotl.hex} isWinner={phase === 'RESULTS' && winner === axolotl.id} />

                                {/* Corona animada si gana */}
                                {phase === 'RESULTS' && winner === axolotl.id && (
                                    <motion.div
                                        initial={{ y: -10, opacity: 0, scale: 0 }}
                                        animate={{ y: -30, opacity: 1, scale: 1.5 }}
                                        className="absolute top-0 right-0 left-0 flex justify-center text-yellow-400 drop-shadow-lg"
                                    >
                                        👑
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>

            {/* PANEL DE RESULTADOS (OVERLAY) */}
            <AnimatePresence>
                {phase === 'RESULTS' && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="absolute inset-x-0 bottom-0 bg-gray-800 rounded-t-[2rem] border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] p-6 max-h-[70vh] overflow-y-auto z-30"
                    >
                        <div className="text-center mb-8">
                            <span className="text-yellow-400 text-sm font-bold tracking-widest uppercase mb-2 block">Ganador Indiscutible</span>
                            <h2 className="text-4xl font-black text-white flex items-center justify-center gap-3">
                                🏆 {AXOLOTLS.find(a => a.id === winner)?.name} 🏆
                            </h2>
                        </div>

                        <div className="space-y-3">
                            {players.map(player => {
                                const playerBet = bets[player.id];
                                const didWin = playerBet.axolotlId === winner;
                                const axolotlInfo = AXOLOTLS.find(a => a.id === playerBet.axolotlId);

                                return (
                                    <div key={player.id} className={`relative overflow-hidden flex items-center justify-between p-4 rounded-2xl border ${didWin ? 'bg-gradient-to-r from-green-900/40 to-green-800/20 border-green-500/50' : 'bg-gray-700/30 border-white/5'}`}>

                                        <div className="flex items-center gap-4 relative z-10">
                                            {/* Icono del Jugador */}
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2 ${didWin ? 'border-yellow-400 bg-yellow-500/20' : 'border-gray-600 bg-gray-700'}`}>
                                                {didWin ? '😎' : '💀'}
                                            </div>
                                            <div>
                                                <h4 className={`font-bold text-lg ${didWin ? 'text-white' : 'text-gray-300'}`}>
                                                    {player.name} {didWin && '🏆'}
                                                </h4>
                                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                                    <span>Le fue al</span>
                                                    <span style={{ color: axolotlInfo.hex }} className="font-bold">{axolotlInfo.name}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right relative z-10">
                                            {didWin ? (
                                                <>
                                                    <span className="block text-green-400 font-black text-2xl">REPARTE {playerBet.amount * 2}</span>
                                                    <span className="text-[10px] text-green-500/70 uppercase font-bold tracking-wider">Premio Doble</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="block text-red-400 font-bold text-xl">APOSTÓ {playerBet.amount}</span>
                                                    <span className="text-[10px] text-red-400/50 uppercase font-bold tracking-wider">Perdedor</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <Button onClick={onClose} className="w-full mt-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold tracking-wide rounded-xl">
                            TERMINAR JUEGO
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AxolotlRaceMinigame;