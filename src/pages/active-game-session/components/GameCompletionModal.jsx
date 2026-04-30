import React from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

// Animación para el fondo oscuro (aparece gradualmente)
const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
};

// Animación para la tarjeta del modal (efecto de zoom con resorte)
const modalVariants = {
    hidden: { scale: 0.7, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    exit: { scale: 0.7, opacity: 0, transition: { duration: 0.2 } },
};

/**
 * Modal que aparece al finalizar la partida de Kamikaze.
 * Muestra un resumen de estadísticas: número de jugadores, retos completados y duración total.
 * Debe estar envuelto en un componente <AnimatePresence> de framer-motion para que sus animaciones
 * de salida funcionen correctamente.
 *
 * @param {Object} props
 * @param {Array} props.players - Lista de jugadores que participaron en la partida.
 * @param {number} props.challengesCompleted - Número de retos completados exitosamente.
 * @param {number} props.gameDuration - Duración total de la partida en segundos.
 * @param {Function} props.onClose - Función para cerrar el modal.
 * @param {Function} props.onRestartGame - Función para reiniciar el tablero con los mismos jugadores.
 * @param {Function} props.onNewGame - Función para reiniciar la aplicación e ir a la configuración de jugadores.
 */
const GameCompletionModal = ({
    onClose,
    players = [],
    challengesCompleted = 0,
    onRestartGame,
    onNewGame,
    gameDuration = 0
}) => {
    /**
     * Convierte segundos a formato mm:ss
     * @param {number} seconds - Segundos a formatear.
     * @returns {string} - Cadena con el formato de tiempo (ej. "05:30").
     */
    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    // Reinicia el juego manteniendo los jugadores
    const handleRestartGame = () => {
        onRestartGame?.();
        onClose?.();
    };

    // Vuelve al inicio para configurar un nuevo juego
    const handleNewGame = () => {
        onNewGame?.();
        onClose?.();
    };

    return (
        <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-300 flex items-center justify-center p-4"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <motion.div
                className="bg-card rounded-xl shadow-graffiti-xl border border-border max-w-md w-full mx-4 overflow-hidden"
                variants={modalVariants}
            >
                {/* Header del modal */}
                <div className="bg-gradient-to-r from-primary to-accent p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                        <Icon name="Trophy" size={32} className="text-white" />
                    </div>
                    <h2 className="font-heading text-2xl text-white mb-2">
                        ¡Partida Terminada!
                    </h2>
                    <p className="text-white/90 text-lg">
                        ¿Suficientemente sobrios para otra ronda?
                    </p>
                </div>

                {/* Contenido del modal */}
                <div className="p-6 space-y-6">
                    {/* Estadísticas del juego */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-surface/50 rounded-lg border border-border">
                            <div className="font-data text-2xl text-primary mb-1">
                                {players?.length}
                            </div>
                            <div className="text-sm text-text-secondary">
                                Jugadores
                            </div>
                        </div>

                        <div className="p-4 bg-surface/50 rounded-lg border border-border">
                            <div className="font-data text-2xl text-secondary mb-1">
                                {challengesCompleted}
                            </div>
                            <div className="text-sm text-text-secondary">
                                Retos Completados
                            </div>
                        </div>

                        <div className="p-4 bg-surface/50 rounded-lg border border-border">
                            <div className="font-data text-2xl text-accent mb-1">
                                {formatDuration(gameDuration)}
                            </div>
                            <div className="text-sm text-text-secondary">
                                Duración
                            </div>
                        </div>
                    </div>

                    {/* Lista de jugadores */}
                    <div className="space-y-2">
                        <h3 className="font-heading text-lg text-text-primary text-center">
                            🎉 ¡Felicidades a todos!
                        </h3>
                        <div className="flex flex-wrap justify-center gap-2">
                            {players?.map((player, index) => (
                                <span
                                    key={player?.id || index}
                                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20"
                                >
                                    {player?.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="space-y-3">
                        <Button
                            variant="default"
                            size="lg"
                            fullWidth
                            onClick={handleRestartGame}
                            className="bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 text-white font-heading text-lg h-12"
                            iconName="RotateCcw"
                            iconPosition="left"
                        >
                            🔄 Volver a Jugar
                        </Button>

                        <Button
                            variant="outline"
                            size="lg"
                            fullWidth
                            onClick={handleNewGame}
                            className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-heading text-lg h-12"
                            iconName="Home"
                            iconPosition="left"
                        >
                            🏠 Salir
                        </Button>
                    </div>

                    {/* Mensaje divertido */}
                    <div className="text-center p-4 bg-warning/10 rounded-lg border border-warning/20">
                        <p className="text-warning font-medium text-sm">
                            🍺 Recuerda beber responsablemente
                        </p>
                        <p className="text-text-secondary text-xs mt-1">
                            ¡La diversión no tiene límites, pero la responsabilidad sí!
                        </p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default GameCompletionModal;