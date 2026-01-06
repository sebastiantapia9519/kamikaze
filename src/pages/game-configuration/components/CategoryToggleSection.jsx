import React from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const CategoryToggleSection = ({ categories, onCategoryChange }) => {
    const categoryOptions = [
        {
            id: 'regular',
            label: 'Retos Regulares',
            description: 'Desafíos divertidos y ligeros para todos',
            icon: 'Smile',
            color: 'text-primary'
        },
        {
            id: 'epic',
            label: 'Retos Épicos',
            description: 'Desafíos intensos y atrevidos',
            icon: 'Zap',
            color: 'text-accent'
        },
        {
            id: 'multiplayer',
            label: 'Retos Multijugador',
            description: 'Actividades grupales y competencias',
            icon: 'Users',
            color: 'text-secondary'
        }
    ];

    return (
        <div className="bg-card/80 backdrop-blur-sm p-6 rounded-lg shadow-graffiti-md border border-border/50">
            <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-primary/20 rounded-lg">
                    <Icon name="Target" size={24} className="text-primary" />
                </div>
                <div>
                    <h2 className="font-heading text-xl text-text-primary">
                        Categorías de Retos
                    </h2>
                    <p className="text-text-secondary text-sm">
                        Personaliza tu experiencia de juego
                    </p>
                </div>
            </div>
            <div className="space-y-4">
                {categoryOptions?.map((category) => (
                    <div
                        key={category?.id}
                        className="group relative p-4 rounded-lg border border-border/30 hover:border-border/60 transition-all duration-200 hover:shadow-graffiti-sm"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4 flex-1">
                                <div className="p-2 bg-surface/50 rounded-lg group-hover:bg-surface/70 transition-colors duration-200">
                                    <Icon
                                        name={category?.icon}
                                        size={20}
                                        className={`${category?.color} group-hover:scale-110 transition-transform duration-200`}
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-body font-semibold text-text-primary mb-1">
                                        {category?.label}
                                    </h3>
                                    <p className="text-text-secondary text-sm">
                                        {category?.description}
                                    </p>
                                </div>
                            </div>

                            <div className="ml-4">
                                <Checkbox
                                    checked={categories?.[category?.id]}
                                    onChange={(e) => onCategoryChange(category?.id, e?.target?.checked)}
                                    size="lg"
                                    className="scale-125"
                                />
                            </div>
                        </div>

                        {/* Active indicator */}
                        {categories?.[category?.id] && (
                            <div className="absolute top-2 right-2">
                                <div className="w-2 h-2 bg-success rounded-full animate-pulse-glow"></div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {/* Category Summary */}
            <div className="mt-6 p-4 bg-surface/30 rounded-lg border border-border/20">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                        <Icon name="CheckCircle" size={16} className="text-success" />
                        <span className="text-text-secondary">
                            Categorías activas:
                        </span>
                    </div>
                    <span className="font-data text-text-primary font-semibold">
                        {Object.values(categories)?.filter(Boolean)?.length} de {categoryOptions?.length}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CategoryToggleSection;