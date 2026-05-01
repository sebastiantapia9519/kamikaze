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
        if (isStarting) return 'Iniciando juego...';
        if (playerCount === 0) return 'Agrega jugadores para comenzar';
        if (playerCount === 1) return 'Necesitas al menos 2 jugadores';
        return `🚀 Iniciar Juego (${playerCount} jugadores)`;
    };

    // === Mensajes de estado debajo del botón ===
    const getStatusMessage = () => {
        if (validationError) {
            return {
                icon: 'AlertTriangle',
                text: validationError,
                color: 'text-error'
            };
        }
        if (playerCount === 0) {
            return {
                icon: 'UserPlus',
                text: 'Agrega al menos 2 jugadores para comenzar',
                color: 'text-text-secondary'
            };
        }
        if (playerCount === 1) {
            return {
                icon: 'AlertCircle',
                text: 'Necesitas 1 jugador más',
                color: 'text-warning'
            };
        }
        return {
            icon: 'CheckCircle',
            text: '¡Todo listo para la diversión!',
            color: 'text-success'
        };
    };

    const status = getStatusMessage();

    // === Mapeo visual de duración del juego ===
    const lengthLabels = {
        quick: { retos: 15, minutos: '10-15' },
        standard: { retos: 30, minutos: '20-30' },
        extended: { retos: 45, minutos: '40-50' }
    };

    // === Render del componente ===
    return (
        <div className="space-y-5">
            {/* 🧠 Mensaje de validación */}
            <div className={`flex items-center justify-center space-x-2 p-4 rounded-xl border backdrop-blur-md shadow-graffiti-sm ${validationError ? 'bg-error/20 border-error/50 shadow-[0_0_10px_rgba(255,0,0,0.3)]' : 'bg-black/40 border-white/10'
                }`}>
                <Icon name={status?.icon} size={20} className={`${status?.color} drop-shadow-md`} />
                <span className={`font-body font-bold ${status?.color} text-center text-sm drop-shadow-sm`}>
                    {status?.text}
                </span>
            </div>



            {/* 🚀 Botón principal */}
            <div className="relative group">
                <div className={`absolute -inset-1 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 ${canStartGame && !isStarting ? 'bg-gradient-to-r from-primary via-accent to-secondary animate-pulse-glow' : 'hidden'}`}></div>
                <Button
                    variant="default"
                    size="lg"
                    fullWidth
                    disabled={!canStartGame}
                    onClick={handleStartGame}
                    className={`relative h-16 font-heading text-xl shadow-graffiti-lg transition-all duration-300 rounded-xl ${canStartGame && !isStarting
                            ? 'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 hover:shadow-[0_0_30px_rgba(255,20,147,0.8)] text-white'
                            : 'bg-white/10 text-white/40 cursor-not-allowed border border-white/5 backdrop-blur-md'
                        }`}
                    iconName={isStarting ? 'Loader' : canStartGame ? 'Play' : 'Lock'}
                    iconPosition="left"
                    iconSize={28}
                    iconClassName={isStarting ? 'animate-spin' : 'drop-shadow-md'}
                >
                    <span className="drop-shadow-md">{getButtonText()}</span>
                </Button>
            </div>

            {/* 📊 Info del juego antes de empezar */}
            {canStartGame && !isStarting && (
                <div className="grid grid-cols-3 gap-4 text-center text-sm mt-6">
                    <div className="p-3 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 hover:border-primary/50 transition-colors shadow-inner">
                        <Icon name="Users" size={20} className="text-primary mx-auto mb-2 drop-shadow-[0_0_5px_rgba(0,128,255,0.8)]" />
                        <div className="font-data text-white font-bold text-lg drop-shadow-sm">{playerCount}</div>
                        <div className="text-white/60 font-medium text-xs uppercase tracking-wider">Jugadores</div>
                    </div>

                    <div className="p-3 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 hover:border-secondary/50 transition-colors shadow-inner">
                        <Icon name="Target" size={20} className="text-secondary mx-auto mb-2 drop-shadow-[0_0_5px_rgba(255,20,147,0.8)]" />
                        <div className="font-data text-white font-bold text-lg drop-shadow-sm">
                            {lengthLabels[selectedLength].retos}
                        </div>
                        <div className="text-white/60 font-medium text-xs uppercase tracking-wider">Retos</div>
                    </div>

                    <div className="p-3 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 hover:border-accent/50 transition-colors shadow-inner">
                        <Icon name="Clock" size={20} className="text-accent mx-auto mb-2 drop-shadow-[0_0_5px_rgba(138,43,226,0.8)]" />
                        <div className="font-data text-white font-bold text-lg drop-shadow-sm">
                            {lengthLabels[selectedLength].minutos}
                        </div>
                        <div className="text-white/60 font-medium text-xs uppercase tracking-wider">Minutos</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameStartButton;
