import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PlayerList = ({ players = [], onRemovePlayer }) => {
    if (players?.length === 0) {
        return (
            <div className="bg-card p-8 rounded-lg shadow-graffiti-md border border-border text-center">
                <Icon name="Users" size={48} className="text-text-secondary mx-auto mb-4" />
                <h3 className="font-heading text-lg text-text-primary mb-2">
                    No hay jugadores aún
                </h3>
                <p className="text-text-secondary">
                    Agrega al menos 2 jugadores para comenzar el juego
                </p>
            </div>
        );
    }

    const playerColors = [
        'from-primary to-accent',
        'from-secondary to-warning',
        'from-accent to-error',
        'from-success to-primary',
        'from-warning to-secondary',
        'from-error to-accent',
        'from-primary to-success',
        'from-accent to-warning'
    ];

    return (
        <div className="bg-card p-6 rounded-lg shadow-graffiti-md border border-border">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-success to-primary rounded-lg flex items-center justify-center">
                        <Icon name="Users" size={20} className="text-white" />
                    </div>
                    <div>
                        <h2 className="font-heading text-xl text-text-primary">
                            Jugadores ({players?.length})
                        </h2>
                        <p className="text-sm text-text-secondary">
                            {players?.length >= 2 ? '¡Listos para jugar!' : `Faltan ${2 - players?.length} jugadores`}
                        </p>
                    </div>
                </div>

                {players?.length >= 2 && (
                    <div className="flex items-center space-x-2 px-3 py-1 bg-success/20 rounded-full border border-success/30">
                        <Icon name="CheckCircle" size={16} className="text-success" />
                        <span className="text-xs font-medium text-success">Válido</span>
                    </div>
                )}
            </div>
            <div className="space-y-3">
                {players?.map((player, index) => (
                    <div
                        key={player?.id}
                        className="group flex items-center justify-between p-4 bg-surface rounded-lg border border-border hover:shadow-graffiti-sm transition-all duration-200"
                    >
                        <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 bg-gradient-to-br ${playerColors?.[index % playerColors?.length]} rounded-full flex items-center justify-center shadow-graffiti-sm`}>
                                <span className="font-heading text-white font-bold">
                                    {player?.name?.charAt(0)?.toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <h3 className="font-body font-semibold text-text-primary">
                                    {player?.name}
                                </h3>
                                <p className="text-xs text-text-secondary">
                                    Jugador #{index + 1}
                                </p>
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemovePlayer(player?.id)}
                            className="text-error hover:text-error hover:bg-error/10 opacity-0 group-hover:opacity-100 transition-opacity"
                            iconName="Trash2"
                            iconSize={16}
                        >
                            <span className="sr-only">Eliminar {player?.name}</span>
                        </Button>
                    </div>
                ))}
            </div>
            {/* Player Limit Warning */}
            {players?.length >= 12 && (
                <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <Icon name="AlertTriangle" size={16} className="text-warning" />
                        <span className="text-sm font-medium text-warning">
                            Máximo recomendado: 12 jugadores
                        </span>
                    </div>
                    <p className="text-xs text-text-secondary mt-1">
                        Demasiados jugadores pueden hacer que el juego sea muy lento
                    </p>
                </div>
            )}
        </div>
    );
};

export default PlayerList;