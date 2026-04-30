import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { motion } from 'framer-motion';

/**
 * Componente que renderiza los controles principales de la partida.
 * Incluye el botón para avanzar al siguiente reto, y acciones secundarias
 * como terminar el juego prematuramente con confirmación de dos pasos.
 * 
 * @param {Object} props
 * @param {Function} props.onNextChallenge - Callback para avanzar al siguiente reto.
 * @param {Function} props.onEndGame - Callback para terminar la partida y mostrar los resultados.
 * @param {boolean} props.isLastChallenge - Indica si el reto actual es el último de la fase.
 * @param {number} props.currentChallenge - Índice del reto actual (para métricas, actualmente oculto).
 * @param {number} props.totalChallenges - Total de retos en la fase actual.
 */
const GameControls = ({
    onNextChallenge,
    onEndGame,
    isLastChallenge = false,
    currentChallenge,
    totalChallenges
}) => {
    const navigate = useNavigate();
    
    // Estado para la confirmación de doble paso al terminar la partida anticipadamente
    const [showEndConfirm, setShowEndConfirm] = useState(false);

    /**
     * Avanza al siguiente reto, o termina el juego si es el último.
     */
    const handleNextChallenge = () => {
        if (isLastChallenge) {
            onEndGame();
        } else {
            onNextChallenge();
        }
    };

    /**
     * Maneja la acción de terminar juego.
     * Requiere dos clics en menos de 5 segundos para confirmar.
     */
    const handleEndGame = () => {
        if (showEndConfirm) {
            onEndGame();
        } else {
            setShowEndConfirm(true);
            setTimeout(() => {
                setShowEndConfirm(false);
            }, 5000);
        }
    };

    // (Opcional, no usado en el render por ahora) Vuelve al dashboard sin terminar el juego.
    const handleBackToMenu = () => {
        navigate('/home-dashboard');
    };

    return (
        <div className="space-y-4">
            {/* Acción Principal */}
            <motion.div
                className="flex justify-center"
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
                <Button
                    variant="default"
                    size="lg"
                    onClick={handleNextChallenge}
                    className="w-full max-w-sm bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-graffiti-md hover:shadow-graffiti-lg transition-all duration-300">

                    <span className="mr-2 font-heading text-lg">
                        {isLastChallenge ? 'Finalizar Juego' : 'Siguiente Reto'}
                    </span>
                    <Icon
                        name={isLastChallenge ? 'Flag' : 'ChevronRight'}
                        size={20} />

                </Button>
            </motion.div>

            {/* Acciones Secundarias */}
            <div className="flex justify-center space-x-4">
                {/* Botón Terminar Juego (Solo visible si no es el último reto) */}
                {!isLastChallenge &&
                    <Button
                        variant={showEndConfirm ? "destructive" : "outline"}
                        size="sm"
                        onClick={handleEndGame}
                        className={showEndConfirm ? "shadow-graffiti-md" : "border-error text-error hover:bg-error hover:text-error-foreground"}>

                        <Icon name={showEndConfirm ? 'AlertTriangle' : 'X'} size={16} />
                        <span className="ml-1">
                            {showEndConfirm ? 'Confirmar Fin' : 'Terminar'}
                        </span>
                    </Button>
                }
            </div>

            {/* Estadísticas Ocultas (Progreso) */}
            <div className="flex justify-center">
                <div className="bg-surface/50 rounded-lg px-4 py-2 items-center space-x-4 text-sm hidden">
                    <div className="flex items-center space-x-1">
                        <Icon name="Target" size={14} className="text-primary" />
                        <span className="text-text-secondary">
                            Progreso: {currentChallenge}/{totalChallenges}
                        </span>
                    </div>
                    <div className="w-1 h-1 bg-text-secondary rounded-full" />
                    <div className="flex items-center space-x-1">
                        <Icon name="Zap" size={14} className="text-accent" />
                        <span className="text-text-secondary">
                            Restantes: {totalChallenges - currentChallenge}
                        </span>
                    </div>
                </div>
            </div>

            {/* Alerta de confirmación de fin de juego */}
            {showEndConfirm &&
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                        <Icon name="AlertCircle" size={18} className="text-warning" />
                        <span className="font-medium text-warning">
                            ¿Terminar el juego?
                        </span>
                    </div>
                    <p className="text-sm text-text-secondary">
                        Se perderá el progreso actual del juego.
                    </p>
                </div>
            }
        </div>
    );
};

export default GameControls;