import React from 'react';
import Icon from '../../../components/AppIcon';

const GameFeaturesGrid = () => {
    const features = [
        {
            icon: 'Shuffle',
            title: 'Retos Aleatorios',
            description: 'Sistema inteligente que evita repeticiones durante 30 rondas completas',
            color: 'text-primary'
        },
        {
            icon: 'Users',
            title: 'Multijugador',
            description: 'Perfecto para grupos de 2 a 8 jugadores con asignación automática',
            color: 'text-secondary'
        },
        {
            icon: 'Smartphone',
            title: 'PWA Móvil',
            description: 'Instálalo como app nativa en iOS y Android para acceso offline',
            color: 'text-accent'
        },
        {
            icon: 'Settings',
            title: 'Personalizable',
            description: 'Activa o desactiva categorías según las preferencias del grupo',
            color: 'text-success'
        },
        {
            icon: 'Palette',
            title: 'Estilo Graffiti',
            description: 'Diseño urbano vibrante que captura la energía de la fiesta',
            color: 'text-warning'
        },
        {
            icon: 'Shield',
            title: 'Juego Responsable',
            description: 'Incluye recordatorios de consumo responsable y límites saludables',
            color: 'text-error'
        }
    ];

    return (
        <div className="mb-8">
            <h3 className="font-heading text-xl text-text-primary mb-6 text-center">
                Características Principales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {features?.map((feature, index) => (
                    <div
                        key={index}
                        className="bg-surface/30 p-4 rounded-lg border border-border hover:shadow-graffiti-sm transition-all duration-300"
                    >
                        <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg bg-background/50 ${feature?.color}`}>
                                <Icon name={feature?.icon} size={20} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-body font-semibold text-text-primary mb-1">
                                    {feature?.title}
                                </h4>
                                <p className="text-sm text-text-secondary leading-relaxed">
                                    {feature?.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GameFeaturesGrid;