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
        <div className="bg-zinc-900/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/10 relative overflow-hidden">

            {/* Encabezado del formulario */}
            <div className="flex items-center space-x-4 mb-5">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                    <Icon name="UserPlus" size={24} className="text-white drop-shadow-sm" />
                </div>
                <div>
                    <h2 className="font-heading text-2xl text-white">
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
                            className="font-body text-white bg-zinc-800/80 border-white/20 focus:border-cyan-500 focus:ring-cyan-500 shadow-inner placeholder:text-white/40 h-12 text-lg rounded-xl"
                            maxLength={20}
                        />
                    </div>
                    <Button
                        type="submit"
                        variant="default"
                        disabled={!playerName?.trim()}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white font-heading whitespace-nowrap h-12 rounded-xl shadow-md transition-all"
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