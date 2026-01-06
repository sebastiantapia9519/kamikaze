import React from 'react';
import Icon from '../../../components/AppIcon';

const GameStatsPreview = () => {
    const gameStats = [
        {
            icon: 'Users',
            label: 'Jugadores',
            value: '2-12',
            color: 'text-primary'
        },
        {
            icon: 'Clock',
            label: 'Duración',
            value: '15-30 min',
            color: 'text-accent'
        },
        {
            icon: 'Zap',
            label: 'Intensidad',
            value: 'Alta energía',
            color: 'text-secondary'
        }];


    return (
        <div className="mt-12 p-6 bg-surface/30 backdrop-blur-sm rounded-lg border border-border/50 shadow-graffiti-sm hidden">
            <div className="text-center mb-4">
                <h3 className="font-body font-semibold text-text-primary mb-1">
                    Información del Juego
                </h3>
                <p className="text-sm text-text-secondary">
                    Todo lo que necesitas saber
                </p>
            </div>
            <div className="grid grid-cols-3 gap-4">
                {gameStats?.map((stat, index) =>
                    <div key={index} className="text-center space-y-2">
                        <div className="flex justify-center">
                            <div className="p-2 rounded-lg bg-background/20">
                                <Icon
                                    name={stat?.icon}
                                    size={20}
                                    className={stat?.color} />

                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-text-secondary font-caption">
                                {stat?.label}
                            </p>
                            <p className="text-sm font-medium text-text-primary font-body">
                                {stat?.value}
                            </p>
                        </div>
                    </div>
                )}
            </div>
            {/* Fun fact */}
            <div className="mt-4 pt-4 border-t border-border/30 text-center">
                <p className="text-xs text-text-secondary font-caption">
                    <Icon name="Sparkles" size={14} className="inline mr-1 text-accent" />
                    Más de 100 retos únicos te esperan
                </p>
            </div>
        </div>);

};

export default GameStatsPreview;