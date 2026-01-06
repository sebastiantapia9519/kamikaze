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
        <div className="space-y-4">
            {/* 🧠 Mensaje de validación */}
            <div className={`flex items-center justify-center space-x-2 p-4 rounded-lg border ${validationError ? 'bg-error/10 border-error/20' : 'bg-surface/50 border-border'
                }`}>
                <Icon name={status?.icon} size={20} className={status?.color} />
                <span className={`font-body font-medium ${status?.color} text-center text-sm`}>
                    {status?.text}
                </span>
            </div>



            {/* 🚀 Botón principal */}
            <div className="relative">
                <Button
                    variant="default"
                    size="lg"
                    fullWidth
                    disabled={!canStartGame}
                    onClick={handleStartGame}
                    className={`h-14 font-heading text-lg shadow-graffiti-lg transition-all duration-300 ${canStartGame && !isStarting
                            ? 'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 hover:shadow-graffiti-lg animate-pulse-glow'
                            : 'bg-surface text-text-secondary cursor-not-allowed'
                        }`}
                    iconName={isStarting ? 'Loader' : canStartGame ? 'Play' : 'Lock'}
                    iconPosition="left"
                    iconSize={24}
                    iconClassName={isStarting ? 'animate-spin' : ''}
                >
                    {getButtonText()}
                </Button>
            </div>

            {/* 📊 Info del juego antes de empezar */}
            {canStartGame && !isStarting && (
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div className="p-3 bg-card rounded-lg border border-border">
                        <Icon name="Users" size={16} className="text-primary mx-auto mb-1" />
                        <div className="font-data text-text-primary">{playerCount}</div>
                        <div className="text-text-secondary">Jugadores</div>
                    </div>

                    <div className="p-3 bg-card rounded-lg border border-border">
                        <Icon name="Target" size={16} className="text-secondary mx-auto mb-1" />
                        <div className="font-data text-text-primary">
                            {lengthLabels[selectedLength].retos}
                        </div>
                        <div className="text-text-secondary">Retos</div>
                    </div>

                    <div className="p-3 bg-card rounded-lg border border-border">
                        <Icon name="Clock" size={16} className="text-accent mx-auto mb-1" />
                        <div className="font-data text-text-primary">
                            {lengthLabels[selectedLength].minutos}
                        </div>
                        <div className="text-text-secondary">Minutos</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameStartButton;
