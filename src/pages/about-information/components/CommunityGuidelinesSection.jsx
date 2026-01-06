import React from 'react';
import Icon from '../../../components/AppIcon';

const CommunityGuidelinesSection = () => {
    const guidelines = [
        {
            icon: 'Heart',
            title: 'Respeto y Diversión',
            description: 'Los retos deben ser divertidos para todos, sin humillaciones ni contenido ofensivo',
            color: 'text-success'
        },
        {
            icon: 'Shield',
            title: 'Seguridad Primero',
            description: 'Evita retos peligrosos, ilegales o que pongan en riesgo la salud física o mental',
            color: 'text-warning'
        },
        {
            icon: 'Users',
            title: 'Inclusividad',
            description: 'Crea retos que puedan disfrutar personas de diferentes personalidades y comodidades',
            color: 'text-primary'
        },
        {
            icon: 'Lightbulb',
            title: 'Creatividad Original',
            description: 'Aporta ideas únicas y originales que no se encuentren ya en el juego',
            color: 'text-accent'
        }
    ];

    return (
        <div className="bg-card p-6 rounded-lg shadow-graffiti-md">
            <div className="flex items-center space-x-3 mb-6">
                <Icon name="BookOpen" size={24} className="text-secondary" />
                <h3 className="font-heading text-xl text-text-primary">
                    Guías de la Comunidad
                </h3>
            </div>
            <p className="font-body text-text-secondary mb-6">
                Para mantener Kamikaze divertido y seguro para todos, sigue estas pautas al proponer nuevos retos:
            </p>
            <div className="space-y-4">
                {guidelines?.map((guideline, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-surface/30 rounded-lg">
                        <div className={`p-2 rounded-lg bg-background/50 ${guideline?.color}`}>
                            <Icon name={guideline?.icon} size={20} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-body font-semibold text-text-primary mb-2">
                                {guideline?.title}
                            </h4>
                            <p className="text-sm text-text-secondary leading-relaxed">
                                {guideline?.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Star" size={18} className="text-primary" />
                    <span className="font-body font-medium text-primary">
                        Proceso de Revisión
                    </span>
                </div>
                <p className="text-sm text-text-secondary">
                    Todos los retos propuestos pasan por un proceso de revisión para garantizar que cumplan con nuestras pautas de comunidad antes de ser añadidos al juego.
                </p>
            </div>
        </div>
    );
};

export default CommunityGuidelinesSection;