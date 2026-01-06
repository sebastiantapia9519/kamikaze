import React from 'react';
import { motion } from 'framer-motion'; // <-- 1. IMPORTAMOS MOTION PARA LAS ANIMACIONES
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

/**
 * GameCompletionModal
 * ------------------
 * Modal que aparece al finalizar la partida.
 * Ahora recibe `gameDuration` en segundos para mostrar la duración total del juego.
 */

// --- 2. DEFINIMOS LAS VARIANTES (ESTADOS) DE NUESTRA ANIMACIÓN ---
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


const GameCompletionModal = ({
    isVisible,            // Boolean: si el modal debe mostrarse (AHORA MANEJADO POR ANIMATEPRESENCE)
    onClose,              // Función: cerrar modal
    players = [],         // Array: jugadores
    challengesCompleted = 0, // Número de retos completados
    onRestartGame,        // Función: reiniciar la partida con los mismos jugadores
    onNewGame,            // Función: iniciar nueva partida
    gameDuration = 0      // Duración de la partida en segundos
}) => {

    // YA NO NECESITAMOS ESTA LÍNEA. AnimatePresence en el componente padre se encarga de la visibilidad.
    // if (!isVisible) return null;

    /**
     * formatDuration
     * --------------
     * Convierte segundos a formato mm:ss
     */
    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    // Reiniciar juego con los mismos jugadores
    const handleRestartGame = () => {
        onRestartGame?.(); // Llama la función pasada
        onClose?.();       // Cierra el modal
    };

    // Iniciar nueva partida desde el setup
    const handleNewGame = () => {
        onNewGame?.(); // Llama la función pasada
        onClose?.();   // Cierra el modal
    };

    return (
        // --- 3. APLICAMOS LAS ANIMACIONES ---
        // Reemplazamos los 'div' por 'motion.div' y les pasamos las variantes que definimos.
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

                {/* Header del modal (sin cambios de funcionalidad) */}
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

                {/* Contenido del modal (sin cambios de funcionalidad) */}
                <div className="p-6 space-y-6">

                    {/* Estadísticas del juego */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                        {/* Número de jugadores */}
                        <div className="p-4 bg-surface/50 rounded-lg border border-border">
                            <div className="font-data text-2xl text-primary mb-1">
                                {players?.length}
                            </div>
                            <div className="text-sm text-text-secondary">
                                Jugadores
                            </div>
                        </div>

                        {/* Retos completados */}
                        <div className="p-4 bg-surface/50 rounded-lg border border-border">
                            <div className="font-data text-2xl text-secondary mb-1">
                                {challengesCompleted}
                            </div>
                            <div className="text-sm text-text-secondary">
                                Retos Completados
                            </div>
                        </div>

                        {/* Duración de la partida */}
                        <div className="p-4 bg-surface/50 rounded-lg border border-border">
                            <div className="font-data text-2xl text-accent mb-1">
                                {formatDuration(gameDuration)} {/* Formatea segundos a mm:ss */}
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
                        {/* Volver a jugar con los mismos jugadores */}
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

                        {/* Nuevo juego */}
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