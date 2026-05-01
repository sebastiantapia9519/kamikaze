import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

/**
 * Formulario para añadir nuevos jugadores a la partida.
 * Incluye validación de nombres (longitud, duplicados) y una lista de
 * sugerencias rápidas para agilizar la entrada de datos.
 * 
 * @param {Object} props
 * @param {Function} props.onAddPlayer - Callback invocado con el nombre validado del nuevo jugador.
 * @param {Array} [props.existingPlayers=[]] - Lista actual de jugadores para validar que no haya duplicados.
 */
const PlayerInputForm = ({ onAddPlayer, existingPlayers = [] }) => {
    const [playerName, setPlayerName] = useState('');
    const [error, setError] = useState('');

    /**
     * Valida el nombre ingresado por el usuario.
     * 
     * @param {string} name - Nombre a validar.
     * @returns {string|null} Mensaje de error si falla la validación, o null si es válido.
     */
    const validatePlayerName = (name) => {
        const trimmedName = name?.trim();

        if (!trimmedName) {
            return 'El nombre del jugador no puede estar vacío';
        }

        if (trimmedName?.length < 2) {
            return 'El nombre debe tener al menos 2 caracteres';
        }

        if (trimmedName?.length > 20) {
            return 'El nombre no puede tener más de 20 caracteres';
        }

        if (existingPlayers?.some(player =>
            player?.name?.toLowerCase() === trimmedName?.toLowerCase()
        )) {
            return 'Este nombre ya está en uso';
        }

        return null;
    };

    /**
     * Maneja el envío del formulario, validando antes de invocar el callback.
     */
    const handleSubmit = (e) => {
        e?.preventDefault();

        const validationError = validatePlayerName(playerName);
        if (validationError) {
            setError(validationError);
            return;
        }

        onAddPlayer(playerName?.trim());
        setPlayerName('');
        setError('');
    };

    /**
     * Maneja el cambio en el input de texto, limpiando errores previos si los hay.
     */
    const handleInputChange = (e) => {
        const value = e?.target?.value;
        setPlayerName(value);

        // Limpiar el error cuando el usuario empieza a escribir de nuevo
        if (error && value?.trim()) {
            setError('');
        }
    };

    return (
        <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl shadow-graffiti-lg border border-white/10 relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-secondary opacity-50"></div>

            {/* Encabezado del formulario */}
            <div className="flex items-center space-x-4 mb-5">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,128,255,0.6)]">
                    <Icon name="UserPlus" size={24} className="text-white drop-shadow-md" />
                </div>
                <div>
                    <h2 className="font-heading text-2xl text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                        Agregar Jugadores
                    </h2>
                    <p className="text-sm text-white/70 font-medium mt-1">
                        Mínimo 2 jugadores para comenzar
                    </p>
                </div>
            </div>

            {/* Formulario Principal */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Input
                            type="text"
                            placeholder="Nombre del jugador..."
                            value={playerName}
                            onChange={handleInputChange}
                            error={error}
                            className="font-body text-white bg-black/50 border-white/20 focus:border-primary focus:ring-primary shadow-inner placeholder:text-white/40 h-12 text-lg rounded-xl"
                            maxLength={20}
                        />
                    </div>
                    <Button
                        type="submit"
                        variant="default"
                        disabled={!playerName?.trim()}
                        className="bg-gradient-to-r from-secondary to-warning hover:from-secondary/90 hover:to-warning/90 text-secondary-foreground font-heading whitespace-nowrap h-12 rounded-xl shadow-[0_0_15px_rgba(255,20,147,0.5)] hover:shadow-[0_0_25px_rgba(255,20,147,0.8)] transition-all"
                        iconName="Plus"
                        iconPosition="left"
                    >
                        Agregar Jugador
                    </Button>
                </div>
            </form>

            {/* Sugerencias Rápidas */}
            <div className="mt-5 flex flex-wrap gap-2 items-center">
                <span className="text-xs text-white/60 font-medium mr-1">Sugerencias rápidas:</span>
                {['Alejandra', 'Alejandro', 'Diana', 'Carlos', 'María', 'Sebastian', 'Sergio']?.map((suggestion) => (
                    <button
                        key={suggestion}
                        type="button"
                        onClick={() => {
                            if (!existingPlayers?.some(p => p?.name?.toLowerCase() === suggestion?.toLowerCase())) {
                                setPlayerName(suggestion);
                                setError('');
                            }
                        }}
                        disabled={existingPlayers?.some(p => p?.name?.toLowerCase() === suggestion?.toLowerCase())}
                        className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/15 text-white/80 hover:text-white rounded-full border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:shadow-[0_0_8px_rgba(255,255,255,0.3)] backdrop-blur-sm"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PlayerInputForm;