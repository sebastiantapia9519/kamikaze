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
        <div className="bg-card p-6 rounded-lg shadow-graffiti-md border border-border">
            {/* Encabezado del formulario */}
            <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                    <Icon name="UserPlus" size={20} className="text-white" />
                </div>
                <div>
                    <h2 className="font-heading text-xl text-text-primary">
                        Agregar Jugadores
                    </h2>
                    <p className="text-sm text-text-secondary">
                        Mínimo 2 jugadores para comenzar
                    </p>
                </div>
            </div>

            {/* Formulario Principal */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                        <Input
                            type="text"
                            placeholder="Nombre del jugador..."
                            value={playerName}
                            onChange={handleInputChange}
                            error={error}
                            className="font-body"
                            maxLength={20}
                        />
                    </div>
                    <Button
                        type="submit"
                        variant="default"
                        disabled={!playerName?.trim()}
                        className="bg-gradient-to-r from-secondary to-warning hover:from-secondary/90 hover:to-warning/90 text-secondary-foreground font-heading whitespace-nowrap"
                        iconName="Plus"
                        iconPosition="left"
                    >
                        Agregar Jugador
                    </Button>
                </div>
            </form>

            {/* Sugerencias Rápidas */}
            <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs text-text-secondary">Sugerencias rápidas:</span>
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
                        className="px-2 py-1 text-xs bg-surface hover:bg-surface/80 text-text-secondary hover:text-text-primary rounded border border-border disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PlayerInputForm;