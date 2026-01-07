import React from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const CategoryToggleSection = ({ categories, onCategoryChange }) => {
    // Definimos las opciones con colores vibrantes para que resalten sobre negro
    const categoryOptions = [
        {
            id: 'regular',
            label: 'Retos Regulares',
            description: 'Desafíos divertidos y ligeros para todos',
            icon: 'Smile',
            color: 'text-cyan-400', // Color vibrante
            bgIcon: 'bg-cyan-400/20' // Fondo del icono
        },
        {
            id: 'epic',
            label: 'Retos Épicos',
            description: 'Desafíos intensos y atrevidos',
            icon: 'Zap',
            color: 'text-yellow-400',
            bgIcon: 'bg-yellow-400/20'
        },
        {
            id: 'multiplayer',
            label: 'Retos Multijugador',
            description: 'Actividades grupales y competencias',
            icon: 'Users',
            color: 'text-pink-400',
            bgIcon: 'bg-pink-400/20'
        }
    ];

    return (
        // CONTENEDOR PRINCIPAL: Negro profundo (bg-gray-900)
        <div className="bg-gray-900 p-6 rounded-2xl shadow-xl border border-white/10">

            {/* ENCABEZADO DE SECCIÓN */}
            <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gray-800 rounded-lg border border-white/5">
                    <Icon name="Target" size={24} className="text-white" />
                </div>
                <div>
                    <h2 className="font-bold text-xl text-white">
                        Categorías de Retos
                    </h2>
                    <p className="text-gray-400 text-sm">
                        Personaliza tu experiencia de juego
                    </p>
                </div>
            </div>

            {/* LISTA DE OPCIONES */}
            <div className="space-y-4">
                {categoryOptions.map((category) => (
                    <div
                        key={category.id}
                        // TARJETA INDIVIDUAL: Gris oscuro (bg-gray-800/40) para diferenciar del fondo
                        className={`group relative p-4 rounded-xl border transition-all duration-200 
                        ${categories[category.id]
                                ? 'bg-gray-800/60 border-white/20 shadow-md'
                                : 'bg-gray-800/20 border-white/5 opacity-70'}`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4 flex-1">
                                {/* ICONO */}
                                <div className={`p-3 rounded-lg transition-colors duration-200 ${category.bgIcon}`}>
                                    <Icon
                                        name={category.icon}
                                        size={24}
                                        className={`${category.color} group-hover:scale-110 transition-transform duration-200`}
                                    />
                                </div>

                                {/* TEXTOS */}
                                <div className="flex-1">
                                    <h3 className={`font-bold text-lg mb-1 ${categories[category.id] ? 'text-white' : 'text-gray-400'}`}>
                                        {category.label}
                                    </h3>
                                    <p className="text-gray-400 text-sm leading-snug">
                                        {category.description}
                                    </p>
                                </div>
                            </div>

                            {/* CHECKBOX */}
                            <div className="ml-4 pt-2">
                                <Checkbox
                                    checked={categories[category.id]}
                                    onChange={(e) => onCategoryChange(category.id, e.target.checked)}
                                    size="lg"
                                    className="scale-110 border-white/30 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                                />
                            </div>
                        </div>

                        {/* Indicador de activo (puntito verde) */}
                        {categories[category.id] && (
                            <div className="absolute top-3 right-3">
                                <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.6)] animate-pulse"></div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* RESUMEN FINAL */}
            <div className="mt-6 p-4 bg-gray-800 rounded-xl border border-white/5 flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                    <Icon name="CheckCircle" size={16} className="text-green-400" />
                    <span className="text-gray-300">
                        Categorías activas:
                    </span>
                </div>
                <span className="font-bold text-white bg-gray-700 px-3 py-1 rounded-lg">
                    {Object.values(categories).filter(Boolean).length} de {categoryOptions.length}
                </span>
            </div>
        </div>
    );
};

export default CategoryToggleSection;