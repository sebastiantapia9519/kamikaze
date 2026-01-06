import React from 'react';
import Icon from '../../../components/AppIcon';

const GameFeaturesGrid = () => {
    // Definimos las características aquí para mantener el JSX limpio
    const features = [
        {
            icon: "Shuffle",
            color: "text-blue-400",
            bg: "bg-blue-400/10",
            title: "Retos Aleatorios",
            desc: "Sistema inteligente que evita repeticiones durante 30 rondas completas."
        },
        {
            icon: "Users",
            color: "text-green-400",
            bg: "bg-green-400/10",
            title: "Multijugador",
            desc: "Perfecto para grupos de 2 a 8 jugadores con asignación automática."
        },
        {
            icon: "Smartphone",
            color: "text-pink-400",
            bg: "bg-pink-400/10",
            title: "PWA Móvil",
            desc: "Instálalo como app nativa en iOS y Android para acceso offline."
        },
        {
            icon: "Settings",
            color: "text-cyan-400",
            bg: "bg-cyan-400/10",
            title: "Personalizable",
            desc: "Activa o desactiva categorías según las preferencias del grupo."
        },
        {
            icon: "PenTool", // O el icono que uses para arte/graffiti
            color: "text-yellow-400",
            bg: "bg-yellow-400/10",
            title: "Estilo Graffiti",
            desc: "Diseño urbano vibrante que captura la energía de la fiesta."
        },
        {
            icon: "Shield",
            color: "text-red-400",
            bg: "bg-red-400/10",
            title: "Juego Responsable",
            desc: "Incluye recordatorios de consumo responsable y límites saludables."
        }
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-black text-white text-center mb-6 shadow-black drop-shadow-md">
                Características Principales
            </h2>

            {/* GRID RESPONSIVE */}
            {/* grid-cols-1 en móvil, grid-cols-2 en tablet, grid-cols-3 en escritorio */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {features.map((feature, index) => (
                    // CARTA INDIVIDUAL CON ESTILO OSCURO UNIFICADO
                    <div
                        key={index}
                        className="bg-gray-900 rounded-xl p-5 border border-white/10 shadow-lg hover:border-white/20 transition-colors duration-300"
                    >
                        <div className="flex items-start space-x-4">
                            {/* CAJA DEL ICONO */}
                            <div className={`p-3 rounded-lg ${feature.bg} ${feature.color} shadow-inner`}>
                                <Icon name={feature.icon} size={24} />
                            </div>

                            {/* TEXTOS */}
                            <div>
                                <h3 className="text-white font-bold text-lg mb-1">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400 text-sm leading-snug">
                                    {feature.desc}
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