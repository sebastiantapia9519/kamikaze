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
            <div className="bg-black/40 backdrop-blur-md p-8 rounded-2xl shadow-graffiti-lg border border-white/10 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-secondary opacity-50"></div>
                <Icon name="Users" size={48} className="text-white/40 mx-auto mb-4" />
                <h3 className="font-heading text-xl text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] mb-2">
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
        'from-primary to-accent shadow-[0_0_10px_rgba(0,128,255,0.6)]',
        'from-secondary to-warning shadow-[0_0_10px_rgba(255,20,147,0.6)]',
        'from-accent to-error shadow-[0_0_10px_rgba(138,43,226,0.6)]',
        'from-success to-primary shadow-[0_0_10px_rgba(0,255,128,0.6)]',
        'from-warning to-secondary shadow-[0_0_10px_rgba(255,165,0,0.6)]',
        'from-error to-accent shadow-[0_0_10px_rgba(255,0,0,0.6)]',
        'from-primary to-success shadow-[0_0_10px_rgba(0,128,255,0.6)]',
        'from-accent to-warning shadow-[0_0_10px_rgba(138,43,226,0.6)]'
    ];

    return (
        <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl shadow-graffiti-lg border border-white/10 relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-secondary opacity-50"></div>

            {/* ENCABEZADO DE LA LISTA */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-success to-primary rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,255,128,0.6)]">
                        <Icon name="Users" size={24} className="text-white drop-shadow-md" />
                    </div>
                    <div>
                        <h2 className="font-heading text-2xl text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                            Jugadores ({players?.length})
                        </h2>
                        <p className="text-sm text-white/70 font-medium mt-1">
                            {players?.length >= 2 ? '¡Listos para jugar!' : `Faltan ${2 - players?.length} jugadores`}
                        </p>
                    </div>
                </div>

                {/* Badge de validación (Mínimo 2 jugadores) */}
                {players?.length >= 2 && (
                    <div className="flex items-center space-x-2 px-4 py-1.5 bg-success/20 rounded-full border border-success/50 shadow-[0_0_10px_rgba(0,255,128,0.3)]">
                        <Icon name="CheckCircle" size={16} className="text-success drop-shadow-[0_0_5px_rgba(0,255,128,0.8)]" />
                        <span className="text-sm font-bold text-success drop-shadow-[0_0_2px_rgba(0,255,128,0.8)]">Válido</span>
                    </div>
                )}
            </div>

            {/* LISTA DE JUGADORES */}
            <div className="space-y-3">
                {players?.map((player, index) => (
                    <div
                        key={player?.id}
                        className="group flex items-center justify-between p-4 bg-black/50 rounded-xl border border-white/10 hover:border-white/30 hover:bg-black/60 shadow-inner transition-all duration-300"
                    >
                        {/* Info del Jugador */}
                        <div className="flex items-center space-x-4">
                            {/* Avatar generado a partir de la inicial */}
                            <div className={`w-12 h-12 bg-gradient-to-br ${playerColors?.[index % playerColors?.length]} rounded-full flex items-center justify-center border-2 border-black/50`}>
                                <span className="font-heading text-xl text-white font-bold drop-shadow-md">
                                    {player?.name?.charAt(0)?.toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <h3 className="font-body font-bold text-lg text-white drop-shadow-sm">
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
                            className="text-error hover:text-error hover:bg-error/20 opacity-0 group-hover:opacity-100 transition-all rounded-full p-2 h-auto w-auto"
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
                <div className="mt-5 p-4 bg-warning/20 border border-warning/50 rounded-xl shadow-[0_0_15px_rgba(255,165,0,0.2)]">
                    <div className="flex items-center space-x-2">
                        <Icon name="AlertTriangle" size={18} className="text-warning drop-shadow-[0_0_5px_rgba(255,165,0,0.8)]" />
                        <span className="text-sm font-bold text-warning drop-shadow-[0_0_2px_rgba(255,165,0,0.8)]">
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