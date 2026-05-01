import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

/**
 * Componente del botón que inicia el juego.
 * Valida jugadores, guarda información y navega a la sesión activa.
 */
const GameStartButton = ({ players = [], disabled = false }) => {
    const navigate = useNavigate();
    const [isStarting, setIsStarting] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [selectedLength, setSelectedLength] = useState('standard'); // 🆕 duración elegida

    // === Mapeo visual de duración del juego ===
    const lengthLabels = {
        quick: { retos: 15, minutos: '10-15' },
        standard: { retos: 30, minutos: '20-30' },
        extended: { retos: 45, minutos: '40-50' }
    };

    // === Validaciones previas antes de iniciar el juego ===
    const validatePlayers = () => {
        if (players?.length < 2) {
            return 'Necesitas al menos 2 jugadores para comenzar el juego';
        }

        const hasEmptyNames = players?.some(player => !player?.name?.trim());
        if (hasEmptyNames) {
            return 'Todos los jugadores deben tener un nombre';
        }

        const names = players?.map(player => player?.name?.toLowerCase()?.trim());
        const uniqueNames = new Set(names);
        if (names?.length !== uniqueNames?.size) {
            return 'No puede haber nombres de jugadores repetidos';
        }

        return null;
    };

    // === Función principal para iniciar el juego ===
    const handleStartGame = async () => {
        const error = validatePlayers();
        if (error) {
            setValidationError(error);
            return;
        }

        setIsStarting(true);
        setValidationError('');

        try {
            // Guardamos jugadores y configuración seleccionada
            const settings = { gameLength: selectedLength };

            localStorage.setItem('kamikazeGamePlayers', JSON.stringify(players));
            localStorage.setItem('kamikazeGameSettings', JSON.stringify(settings));
            localStorage.setItem('kamikazeGameStartTime', new Date()?.toISOString());

            await new Promise(resolve => setTimeout(resolve, 500));

            // 🧭 Navegamos a la pantalla principal del juego
            navigate('/active-game-session', {
                state: { players, settings }
            });
        } catch (error) {
            console.error('Error starting game:', error);
            setValidationError('Error al iniciar el juego. Por favor, intenta nuevamente.');
            setIsStarting(false);
        }
    };

    // === Estado del botón ===
    const playerCount = players?.length;
    const canStartGame = playerCount >= 2 && !disabled && !isStarting;

    // === Texto dinámico del botón ===
    const getButtonText = () => {
        if (isStarting) return 'INICIANDO JUEGO...';
        if (players?.length < 2) return `FALTAN ${2 - players?.length} JUGADORES`;
        return 'INICIAR PARTIDA';
    };

    return (
        <div className="w-full flex flex-col items-center mt-8">

            {/* Panel Superior: Información Resumida */}
            <div className="w-full max-w-md bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 mb-6 shadow-lg flex justify-around">
                {/* Info Jugadores */}
                <div className="flex flex-col items-center">
                    <div className="flex items-center space-x-1 mb-1">
                        <Icon name="Users" size={14} className="text-emerald-400" />
                        <span className="text-xs text-white/70 uppercase tracking-wider font-bold">Jugadores</span>
                    </div>
                    <div className="font-heading text-white font-bold text-lg">
                        {players?.length}
                    </div>
                </div>

                {/* Info Retos (Basado en duración) */}
                <div className="flex flex-col items-center border-l border-white/10 pl-6">
                    <div className="flex items-center space-x-1 mb-1">
                        <Icon name="Target" size={14} className="text-cyan-400" />
                        <span className="text-xs text-white/70 uppercase tracking-wider font-bold">Retos</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="font-heading text-white font-bold text-lg">
                            {lengthLabels[selectedLength].retos}
                        </div>
                    </div>
                </div>

                {/* Info Tiempo (Estimado) */}
                <div className="flex flex-col items-center border-l border-white/10 pl-6">
                    <div className="flex items-center space-x-1 mb-1">
                        <Icon name="Clock" size={14} className="text-purple-400" />
                        <span className="text-xs text-white/70 uppercase tracking-wider font-bold">Minutos</span>
                    </div>
                    <div className="font-heading text-white font-bold text-lg">
                        ~{lengthLabels[selectedLength].minutos}
                    </div>
                </div>
            </div>

            {/* BOTÓN PRINCIPAL DE INICIO */}
            <div className="relative group w-full max-w-sm">
                <Button
                    variant="default"
                    disabled={!canStartGame}
                    onClick={handleStartGame}
                    className={`relative w-full h-16 font-heading text-xl transition-all duration-300 rounded-xl shadow-lg ${canStartGame && !isStarting
                            ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                            : 'bg-zinc-800 text-white/40 cursor-not-allowed border border-white/10'
                        }`}
                >
                    {isStarting && (
                        <Icon name="Loader" className="animate-spin mr-3" size={24} />
                    )}

                    {!isStarting && canStartGame && (
                        <Icon name="Play" className="mr-2" size={24} />
                    )}

                    {!canStartGame && !isStarting && (
                        <Icon name="Lock" className="mr-2 opacity-50" size={20} />
                    )}

                    <span>{getButtonText()}</span>
                </Button>
            </div>
        </div>
    );
};

export default GameStartButton;
