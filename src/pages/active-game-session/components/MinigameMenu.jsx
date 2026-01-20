import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

// --- LISTA DE ICONOS DE BEBIDA ---
const DRINK_ICONS = [
    { name: 'Beer', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { name: 'Wine', color: 'text-red-400', bg: 'bg-red-500/10' },
    { name: 'Martini', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { name: 'Flame', color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { name: 'Zap', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { name: 'Skull', color: 'text-gray-400', bg: 'bg-gray-500/10' }
];

const MinigameMenu = ({ isOpen, onClose, onSelectGame, players, onUpdatePlayers }) => {
    const [view, setView] = useState('games');

    if (!isOpen) return null;

    const minigames = [
        { id: 'race', label: 'Carrera de Ajolotes', icon: 'Trophy', color: 'text-pink-400', border: 'border-pink-500/50' },
        { id: 'sniper', label: 'Francotirador', icon: 'Crosshair', color: 'text-red-400', border: 'border-red-500/50' },
        { id: 'roulette', label: 'Ruleta Dactilar', icon: 'Hand', color: 'text-purple-400', border: 'border-purple-500/50' },
        { id: 'battle', label: 'Batalla de Pulgares', icon: 'Zap', color: 'text-yellow-400', border: 'border-yellow-500/50' },
        { id: 'bomb', label: '¡Córtale! (Bomba)', icon: 'Timer', color: 'text-cyan-400', border: 'border-cyan-500/50' },

        // --- JUEGOS NUEVOS ---
        { id: 'cards', label: 'Cartas del Destino', icon: 'Layers', color: 'text-blue-400', border: 'border-blue-500/50' },
        { id: 'sequence', label: 'Secuencia Tóxica', icon: 'Activity', color: 'text-fuchsia-400', border: 'border-fuchsia-500/50' },
        { id: 'traffic', label: 'Semáforo Borracho', icon: 'Shuffle', color: 'text-orange-400', border: 'border-orange-500/50' },
    ];

    // --- LOGICA DE JUGADORES ---
    const addPlayer = () => {
        const newId = Date.now();
        onUpdatePlayers([...players, { id: newId, name: '', iconIdx: 0 }]);
    };

    const removePlayer = (id) => {
        if (players.length > 1) {
            onUpdatePlayers(players.filter(p => p.id !== id));
        }
    };

    const updatePlayerName = (id, newName) => {
        onUpdatePlayers(players.map(p => p.id === id ? { ...p, name: newName } : p));
    };

    const cyclePlayerIcon = (id, currentIdx = 0) => {
        const nextIdx = (currentIdx + 1) % DRINK_ICONS.length;
        onUpdatePlayers(players.map(p => p.id === id ? { ...p, iconIdx: nextIdx } : p));
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>

                <style>{`
                    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.3); }
                `}</style>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-gray-900 w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[70vh]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* HEADER */}
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-gray-800/50 shrink-0">
                        <div className="flex items-center gap-2">
                            {view === 'players' ? (
                                <button onClick={() => setView('games')} className="mr-1 text-gray-400 hover:text-white transition-colors">
                                    <Icon name="ArrowLeft" size={20} />
                                </button>
                            ) : (
                                <Icon name="Gamepad2" className="text-green-400" />
                            )}

                            <h3 className="text-xl font-bold text-white">
                                {view === 'games' ? 'Minijuegos' : 'Editar Jugadores'}
                            </h3>
                        </div>

                        <div className="flex gap-2">
                            {view === 'games' && (
                                <button
                                    onClick={() => setView('players')}
                                    className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors border border-blue-500/20"
                                    title="Editar Jugadores"
                                >
                                    <Icon name="Users" size={20} />
                                </button>
                            )}
                            <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors">
                                <Icon name="X" size={24} />
                            </button>
                        </div>
                    </div>

                    {/* CONTENIDO SCROLLEABLE */}
                    <div className="p-4 overflow-y-auto custom-scrollbar">

                        {/* VISTA 1: LISTA DE JUEGOS */}
                        {view === 'games' && (
                            <div className="grid grid-cols-1 gap-3">
                                {minigames.map((game) => (
                                    <Button
                                        key={game.id}
                                        variant="ghost"
                                        onClick={() => onSelectGame(game.id)}
                                        className={`w-full justify-start h-auto p-4 bg-gray-800/40 hover:bg-gray-800 border ${game.border} rounded-xl group transition-all`}
                                    >
                                        <div className={`p-3 rounded-lg bg-gray-900 ${game.color} mr-4 group-hover:scale-110 transition-transform`}>
                                            <Icon name={game.icon} size={24} />
                                        </div>
                                        <div className="text-left">
                                            <span className="block text-white font-bold text-lg">{game.label}</span>
                                            <span className="text-gray-400 text-xs">Jugar ahora</span>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        )}

                        {/* VISTA 2: EDITOR DE JUGADORES */}
                        {view === 'players' && (
                            <div className="space-y-3">
                                {players.map((player, index) => {
                                    const currentIconIdx = player.iconIdx !== undefined ? player.iconIdx : 0;
                                    const iconData = DRINK_ICONS[currentIconIdx] || DRINK_ICONS[0];

                                    return (
                                        <motion.div
                                            key={player.id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="flex items-center gap-2 bg-gray-800/30 p-2 rounded-xl border border-white/5 group hover:border-white/10 transition-colors"
                                        >
                                            <span className="text-gray-500 font-bold w-6 text-center text-xs">{index + 1}</span>

                                            <input
                                                type="text"
                                                placeholder={`Jugador ${index + 1}`}
                                                value={player.name}
                                                onChange={(e) => updatePlayerName(player.id, e.target.value)}
                                                className="flex-1 bg-transparent border-none text-white placeholder-gray-600 focus:ring-0 text-sm font-medium focus:outline-none"
                                            />

                                            <button
                                                onClick={() => cyclePlayerIcon(player.id, currentIconIdx)}
                                                className={`p-2 rounded-lg transition-all ${iconData.bg} ${iconData.color} hover:brightness-125 active:scale-95`}
                                                title="Cambiar icono"
                                            >
                                                <Icon name={iconData.name} size={18} />
                                            </button>

                                            {players.length > 1 && (
                                                <button
                                                    onClick={() => removePlayer(player.id)}
                                                    className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Eliminar jugador"
                                                >
                                                    <Icon name="Trash2" size={18} />
                                                </button>
                                            )}
                                        </motion.div>
                                    );
                                })}

                                <Button
                                    variant="ghost"
                                    onClick={addPlayer}
                                    className="w-full border border-dashed border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 hover:bg-gray-800/50 mt-4 h-12"
                                >
                                    <Icon name="Plus" size={18} className="mr-2" /> Agregar Jugador
                                </Button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default MinigameMenu;