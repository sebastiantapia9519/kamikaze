import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

/**
 * Componente que renderiza la lista de jugadores agregados a la partida.
 * Incluye un estado vacío, la lista de nombres con avatares generados a partir
 * de la inicial del nombre, y botones para eliminar jugadores individuales.
 * También muestra advertencias sobre el límite recomendado de jugadores.
 * 
 * @param {Object} props
 * @param {Array} [props.players=[]] - Lista de objetos que representan a los jugadores.
 * @param {Function} props.onRemovePlayer - Función callback invocada al presionar el botón de eliminar.
 */
const PlayerList = ({ players = [], onRemovePlayer }) => {
    // --- ESTADO VACÍO ---
    if (players?.length === 0) {
        return (
            <div className="bg-zinc-900/60 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/10 text-center relative overflow-hidden">
                <Icon name="Users" size={48} className="text-white/40 mx-auto mb-4" />
                <h3 className="font-heading text-xl text-white mb-2">
                    No hay jugadores aún
                </h3>
                <p className="text-white/70 font-medium">
                    Agrega al menos 2 jugadores para comenzar el juego
                </p>
            </div>
        );
    }

    // --- COLORES DE AVATAR ---
    // Clases de gradientes para alternar los colores de los avatares generados
    const playerColors = [
        'from-cyan-500 to-blue-500 shadow-sm',
        'from-purple-500 to-pink-500 shadow-sm',
        'from-orange-500 to-red-500 shadow-sm',
        'from-emerald-500 to-teal-500 shadow-sm',
        'from-yellow-500 to-orange-500 shadow-sm',
        'from-red-500 to-rose-500 shadow-sm',
        'from-blue-500 to-indigo-500 shadow-sm',
        'from-pink-500 to-rose-500 shadow-sm'
    ];

    return (
        <div className="bg-zinc-900/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/10 relative overflow-hidden">

            {/* ENCABEZADO DE LA LISTA */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                        <Icon name="Users" size={24} className="text-white drop-shadow-sm" />
                    </div>
                    <div>
                        <h2 className="font-heading text-2xl text-white">
                            Jugadores ({players?.length})
                        </h2>
                        <p className="text-sm text-white/70 font-medium mt-1">
                            {players?.length >= 2 ? '¡Listos para jugar!' : `Faltan ${2 - players?.length} jugadores`}
                        </p>
                    </div>
                </div>

                {/* Badge de validación (Mínimo 2 jugadores) */}
                {players?.length >= 2 && (
                    <div className="flex items-center space-x-2 px-4 py-1.5 bg-emerald-500/20 rounded-full border border-emerald-500/50 shadow-sm">
                        <Icon name="CheckCircle" size={16} className="text-emerald-400" />
                        <span className="text-sm font-bold text-emerald-400">Válido</span>
                    </div>
                )}
            </div>

            {/* LISTA DE JUGADORES */}
            <div className="space-y-3">
                {players?.map((player, index) => (
                    <div
                        key={player?.id}
                        className="group flex items-center justify-between p-4 bg-zinc-800/80 rounded-xl border border-white/10 hover:border-white/20 hover:bg-zinc-800 shadow-sm transition-all duration-300"
                    >
                        {/* Info del Jugador */}
                        <div className="flex items-center space-x-4">
                            {/* Avatar generado a partir de la inicial */}
                            <div className={`w-12 h-12 bg-gradient-to-br ${playerColors?.[index % playerColors?.length]} rounded-full flex items-center justify-center border border-white/20`}>
                                <span className="font-heading text-xl text-white font-bold drop-shadow-sm">
                                    {player?.name?.charAt(0)?.toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <h3 className="font-body font-bold text-lg text-white">
                                    {player?.name}
                                </h3>
                                <p className="text-xs text-white/60 font-medium">
                                    Jugador #{index + 1}
                                </p>
                            </div>
                        </div>

                        {/* Acción de Eliminar (Oculto hasta hacer hover) */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemovePlayer(player?.id)}
                            className="text-red-400 hover:text-red-400 hover:bg-red-400/20 opacity-0 group-hover:opacity-100 transition-all rounded-full p-2 h-auto w-auto"
                            iconName="Trash2"
                            iconSize={20}
                        >
                            <span className="sr-only">Eliminar {player?.name}</span>
                        </Button>
                    </div>
                ))}
            </div>

            {/* ADVERTENCIA DE LÍMITE DE JUGADORES */}
            {players?.length >= 12 && (
                <div className="mt-5 p-4 bg-orange-500/20 border border-orange-500/50 rounded-xl shadow-sm">
                    <div className="flex items-center space-x-2">
                        <Icon name="AlertTriangle" size={18} className="text-orange-400" />
                        <span className="text-sm font-bold text-orange-400">
                            Máximo recomendado: 12 jugadores
                        </span>
                    </div>
                    <p className="text-xs text-white/70 font-medium mt-1.5 ml-6">
                        Demasiados jugadores pueden hacer que el juego sea muy lento
                    </p>
                </div>
            )}
        </div>
    );
};

export default PlayerList;