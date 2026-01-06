/**
 * @file ChallengeCard.jsx
 * @description Componente que muestra la tarjeta con el reto actual.
 * Versión corregida para igualar el estilo de la imagen de referencia.
 */
import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

// Las variantes de animación no cambian.
const cardVariants = {
    hidden: { x: "100vw", opacity: 0 },
    visible: {
        x: "0vw",
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    },
    exit: {
        x: "-100vw",
        opacity: 0,
        transition: {
            ease: "easeInOut",
            duration: 0.3
        }
    },
};

const ChallengeCard = ({ challenge, currentChallenge, totalChallenges }) => {
    if (!challenge) {
        return null;
    }

    const { text, category, assignedPlayers } = challenge;

    // Determina el color del texto y el ícono de la categoría.
    const isEpic = category === 'Epic';
    const categoryColor = isEpic ? 'text-secondary' : 'text-primary';
    const categoryIcon = isEpic ? 'Zap' : 'Swords';

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            // --- ¡LÍNEA CORREGIDA PARA IGUALAR TU DISEÑO! ---
            // Usamos un fondo de zinc oscuro con alta opacidad, un borde blanco muy sutil,
            // esquinas más redondeadas y un desenfoque de fondo más pronunciado.
            className="bg-zinc-900/80 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/10 min-h-[300px] flex flex-col justify-between"
        >
            {/* --- Contenido de la Tarjeta --- */}
            <div>
                {/* Encabezado con categoría y contador de retos */}
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
                    {/* El tag de la categoría ahora tiene un estilo más limpio */}
                    <div className="flex items-center space-x-2">
                        <Icon name={categoryIcon} size={20} className={categoryColor} />
                        <span className={`font-heading text-xl ${categoryColor}`}>{category}</span>
                    </div>
                    <span className="font-mono text-text-secondary text-sm">
                        {currentChallenge} / {totalChallenges}
                    </span>
                </div>

                {/* Texto principal del reto */}
                <p className="font-body text-2xl md:text-3xl text-white leading-tight mt-4">
                    {text}
                </p>
            </div>

            {/* Sección de jugadores asignados (si aplica) */}
            {assignedPlayers && assignedPlayers.length > 0 && (
                <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="flex items-center space-x-2 mb-3">
                        <Icon name="Users" size={18} className="text-accent" />
                        <h4 className="font-body font-semibold text-accent text-lg">Jugadores Asignados:</h4>
                    </div>
                    {/* Mapeo de los botones de jugador */}
                    <div className="flex flex-wrap gap-2">
                        {assignedPlayers.map((player) => (
                            <div
                                key={player}
                                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-primary to-accent shadow-md"
                            >
                                <span className="font-semibold text-white text-sm">{player}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default ChallengeCard;