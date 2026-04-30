import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';

// Lista de Juegos Disponibles
const GAMES = [
    {
        id: 'race',
        title: 'Carrera de Ajolotes',
        description: '¡Apuesta y bebe!',
        icon: 'Trophy',
        color: 'text-pink-400',
        bg: 'bg-pink-500/10',
        border: 'border-pink-500/20'
    },
    {
        id: 'bomb',
        title: 'Bomba de Tiempo',
        description: 'Tic, tac... ¡BOOM!',
        icon: 'Bomb',
        color: 'text-orange-400',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/20'
    },
    {
        id: 'sequence',
        title: 'Secuencia Tóxica',
        description: 'Memoria o muerte',
        icon: 'Activity', // Icono de pulso/memoria
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/20'
    },
    {
        id: 'sniper',
        title: 'Francotirador Ciego',
        description: 'Puntería invisible',
        icon: 'Crosshair',
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        border: 'border-red-500/20'
    },
    {
        id: 'roulette',
        title: 'Ruleta de Dedos',
        description: '¿Quién será el elegido?',
        icon: 'Hand',
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/20'
    },
    {
        id: 'battle',
        title: 'Batalla de Taps',
        description: 'Velocidad pura',
        icon: 'Zap',
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20'
    },
    {
        id: 'cards',
        title: 'Mayor o Menor',
        description: 'Adivina la carta',
        icon: 'HelpCircle',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20'
    }
    // EL SEMÁFORO HA SIDO ELIMINADO DE AQUÍ
];

const MinigameMenu = ({ isOpen, onClose, onSelectGame }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto"
                    />

                    {/* Menú Sheet */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="bg-gray-900 w-full max-w-lg rounded-t-3xl sm:rounded-2xl border-t sm:border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] pointer-events-auto"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 bg-gray-800/50 flex justify-between items-center sticky top-0 z-10 backdrop-blur-md">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Icon name="Gamepad2" className="text-cyan-400" />
                                Arcade
                            </h3>
                            <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors">
                                <Icon name="X" size={24} />
                            </button>
                        </div>

                        {/* Grid de Juegos */}
                        <div className="p-4 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 gap-3">
                                {GAMES.map((game) => (
                                    <button
                                        key={game.id}
                                        onClick={() => onSelectGame(game.id)}
                                        className={`flex items-center gap-4 p-4 rounded-xl border ${game.border} bg-gray-800/40 hover:bg-gray-800 transition-all active:scale-95 text-left group`}
                                    >
                                        <div className={`p-3 rounded-lg ${game.bg} ${game.color} group-hover:scale-110 transition-transform`}>
                                            <Icon name={game.icon} size={28} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-white font-bold text-lg leading-tight">{game.title}</h4>
                                            <p className="text-gray-400 text-sm">{game.description}</p>
                                        </div>
                                        <Icon name="ChevronRight" className="text-gray-600 group-hover:text-white transition-colors" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default MinigameMenu;