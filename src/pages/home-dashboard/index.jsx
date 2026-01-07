import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// --- COMPONENTS VISUALES ---
import WelcomeHero from './components/WelcomeHero';
import GameStatsPreview from './components/GameStatsPreview';
import PartyAtmosphere from './components/PartyAtmosphere';
import ResponsibilityReminder from './components/ResponsibilityReminder';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// --- ASSETS ---
import bgImage from '../../assets/images/graffiti-bg.png';

// --- MINIJUEGOS & MENÚ ---
import MinigameMenu from '../active-game-session/components/MinigameMenu';
import AxolotlRaceMinigame from '../active-game-session/components/AxolotlRaceMinigame';
import TimeBombMinigame from '../active-game-session/components/TimeBombMinigame';
import BlindSniperMinigame from '../active-game-session/components/BlindSniperMinigame';
import FingerRouletteMinigame from '../active-game-session/components/FingerRouletteMinigame';
import TapBattleMinigame from '../active-game-session/components/TapBattleMinigame';

// --- LISTA DE ICONOS DE BEBIDA (Igual que en MinigameMenu) ---
const DRINK_ICONS = [
    { name: 'Beer', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { name: 'Wine', color: 'text-red-400', bg: 'bg-red-500/10' },
    { name: 'Martini', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { name: 'Flame', color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { name: 'Zap', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { name: 'Skull', color: 'text-gray-400', bg: 'bg-gray-500/10' }
];

// ==========================================
// 1. COMPONENTE INTERNO: QuickPlayerSetup 
// (El formulario emergente para el modo Arcade)
// ==========================================
const QuickPlayerSetup = ({ onClose, onStart }) => {
    // Inicializamos con iconIdx en lugar de gender
    const [players, setPlayers] = useState([
        { id: 1, name: '', iconIdx: 0 }, // Cerveza por defecto
        { id: 2, name: '', iconIdx: 1 }  // Vino por defecto
    ]);

    const addPlayer = () => {
        const newId = players.length + 1;
        // Asignamos un icono rotativo basado en el número de jugador
        const nextIconIdx = players.length % DRINK_ICONS.length;
        setPlayers([...players, { id: newId, name: '', iconIdx: nextIconIdx }]);
    };

    const removePlayer = (id) => {
        if (players.length > 2) setPlayers(players.filter(p => p.id !== id));
    };

    const updatePlayer = (id, field, value) => {
        setPlayers(players.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    // Función para rotar el icono al hacer clic
    const cycleIcon = (id, currentIdx) => {
        const nextIdx = (currentIdx + 1) % DRINK_ICONS.length;
        updatePlayer(id, 'iconIdx', nextIdx);
    };

    const handleStart = () => {
        const validPlayers = players.map((p, index) => ({
            ...p,
            name: p.name.trim() || `Jugador ${index + 1}`
        }));
        onStart(validPlayers);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gray-900 w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
                {/* Header Modal */}
                <div className="p-4 border-b border-white/10 bg-gray-800/50 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Icon name="Users" className="text-cyan-400" />
                        Jugadores Arcade
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <Icon name="X" size={24} />
                    </button>
                </div>

                {/* Formulario */}
                <div className="p-4 overflow-y-auto space-y-3 flex-1 custom-scrollbar">
                    {players.map((player, index) => {
                        // Obtenemos los datos del icono actual
                        const iconData = DRINK_ICONS[player.iconIdx] || DRINK_ICONS[0];

                        return (
                            <div key={player.id} className="flex items-center gap-2 bg-gray-800/30 p-2 rounded-xl border border-white/5">
                                <span className="text-gray-500 font-bold w-6 text-center">{index + 1}</span>
                                <input
                                    type="text"
                                    placeholder={`Nombre Jugador ${index + 1}`}
                                    value={player.name}
                                    onChange={(e) => updatePlayer(player.id, 'name', e.target.value)}
                                    className="flex-1 bg-transparent border-none text-white placeholder-gray-600 focus:ring-0 text-sm font-medium focus:outline-none"
                                />

                                {/* BOTÓN DE ICONO (NUEVO) */}
                                <button
                                    onClick={() => cycleIcon(player.id, player.iconIdx)}
                                    className={`p-2 rounded-lg transition-colors ${iconData.bg} ${iconData.color} hover:brightness-125`}
                                    title="Cambiar Icono"
                                >
                                    <Icon name={iconData.name} size={18} />
                                </button>

                                {players.length > 2 && (
                                    <button onClick={() => removePlayer(player.id)} className="text-gray-600 hover:text-red-400 p-2">
                                        <Icon name="Trash2" size={18} />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                    <Button variant="ghost" onClick={addPlayer} className="w-full border border-dashed border-gray-700 text-gray-400 hover:text-white hover:border-gray-500">
                        <Icon name="Plus" size={16} className="mr-2" /> Agregar Jugador
                    </Button>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 bg-gray-800/50">
                    <Button
                        variant="default"
                        onClick={handleStart}
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg"
                    >
                        <span className="font-bold tracking-wide">CONTINUAR</span>
                        <Icon name="ArrowRight" size={18} className="ml-2" />
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};
// ==========================================
// 2. COMPONENTE PRINCIPAL: HomeDashboard
// ==========================================
const HomeDashboard = () => {
    const navigate = useNavigate();

    // --- ESTADOS ---
    // 'home' | 'setup' | 'menu' | 'playing'
    const [viewState, setViewState] = useState('home');
    const [activeMinigame, setActiveMinigame] = useState(null);
    const [quickPlayers, setQuickPlayers] = useState([]);

    // --- EFECTOS ---
    useEffect(() => {
        const disclaimerAccepted = localStorage.getItem('kamikazeDisclaimerAccepted');
        if (!disclaimerAccepted) {
            navigate('/age-verification-disclaimer');
            return;
        }
        document.title = 'Kamikaze! - Juego de Beber';
    }, [navigate]);

    // --- LÓGICA DE NAVEGACIÓN ---
    const menuOptions = [
        {
            id: 'play',
            title: 'Iniciar Partida',
            description: '¡Que comience el caos!',
            icon: 'Play',
            color: 'text-green-400',
            bg: 'bg-green-500/10',
            border: 'border-green-500/20',
            action: () => navigate('/player-setup')
        },
        {
            id: 'minigames',
            title: 'Minijuegos',
            description: 'Modo Arcade Rápido',
            icon: 'Gamepad2',
            color: 'text-pink-400',
            bg: 'bg-pink-500/10',
            border: 'border-pink-500/20',
            // Lógica inteligente: Si ya hay jugadores, va al menú. Si no, pide nombres.
            action: () => quickPlayers.length > 0 ? setViewState('menu') : setViewState('setup')
        },
        {
            id: 'config',
            title: 'Configuración',
            description: 'Ajusta las reglas',
            icon: 'Settings',
            color: 'text-cyan-400',
            bg: 'bg-cyan-500/10',
            border: 'border-cyan-500/20',
            action: () => navigate('/game-configuration')
        },
        {
            id: 'about',
            title: 'Información',
            description: 'Reglas y Créditos',
            icon: 'Info',
            color: 'text-purple-400',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/20',
            action: () => navigate('/about-information')
        }
    ];

    const handleSetupComplete = (players) => {
        setQuickPlayers(players);
        setViewState('menu');
    };

    const handleSelectGame = (gameId) => {
        setActiveMinigame(gameId);
        setViewState('playing');
    };

    const closeAll = () => {
        setViewState('home');
        setActiveMinigame(null);
    };

    return (
        <div className="min-h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden"
            style={{ backgroundImage: `url(${bgImage})` }}>

            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>

            <PartyAtmosphere />

            {/* --- CONTENIDO PRINCIPAL DEL DASHBOARD --- */}
            {/* Usamos AnimatePresence para desmontar esto cuando viewState cambie */}
            <AnimatePresence mode="wait">
                {viewState === 'home' && (
                    <motion.div
                        key="home-content"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="relative z-10 min-h-screen flex flex-col"
                    >
                        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
                            <div className="max-w-2xl mx-auto">

                                <WelcomeHero />

                                {/* GRID INTERACTIVO */}
                                <div className="grid grid-cols-1 gap-4 mb-8">
                                    {menuOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={option.action}
                                            className={`relative group overflow-hidden p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl text-left bg-gray-900 ${option.border}`}
                                        >
                                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${option.bg.replace('/10', '/30')}`} />

                                            <div className="flex items-center space-x-4 relative z-10">
                                                <div className={`p-4 rounded-xl ${option.bg} ${option.color} group-hover:scale-110 transition-transform duration-300`}>
                                                    <Icon name={option.icon} size={32} />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-bold text-white mb-1">
                                                        {option.title}
                                                    </h2>
                                                    <p className="text-sm text-gray-400 font-medium">
                                                        {option.description}
                                                    </p>
                                                </div>
                                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                                    <Icon name="ChevronRight" className="text-white/50" />
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <GameStatsPreview />
                            </div>
                        </main>

                        <div className="h-20"></div>
                        <ResponsibilityReminder />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- CAPAS DE MINIJUEGOS Y MENÚS --- */}

            {/* 1. Setup Rápido */}
            {viewState === 'setup' && (
                <QuickPlayerSetup onClose={closeAll} onStart={handleSetupComplete} />
            )}

            {/* 2. Menú de Selección */}
            <MinigameMenu
                isOpen={viewState === 'menu'}
                onClose={closeAll}
                onSelectGame={handleSelectGame}
                players={quickPlayers}
                onUpdatePlayers={setQuickPlayers}
            />

            {/* 3. Minijuegos Activos */}
            {viewState === 'playing' && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95">
                    {activeMinigame === 'race' && <AxolotlRaceMinigame players={quickPlayers} onClose={() => setViewState('menu')} />}
                    {activeMinigame === 'bomb' && <TimeBombMinigame currentPlayer={quickPlayers[0]} onClose={() => setViewState('menu')} />}
                    {activeMinigame === 'sniper' && <BlindSniperMinigame currentPlayer={quickPlayers[0]} onClose={() => setViewState('menu')} />}
                    {activeMinigame === 'roulette' && <FingerRouletteMinigame onClose={() => setViewState('menu')} />}
                    {activeMinigame === 'battle' && <TapBattleMinigame players={quickPlayers} onClose={() => setViewState('menu')} />}
                </div>
            )}
        </div>
    );
};

export default HomeDashboard;