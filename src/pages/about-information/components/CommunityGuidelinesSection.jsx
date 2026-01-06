import React from 'react';
import Icon from '../../../components/AppIcon';

const CommunityGuidelinesSection = () => {
    // Definimos los datos con colores explícitos de Tailwind para que resalten en negro
    const guidelines = [
        {
            icon: 'Heart',
            title: 'Respeto y Diversión',
            description: 'Los retos deben ser divertidos para todos, sin humillaciones ni contenido ofensivo',
            color: 'text-pink-400',
            bg: 'bg-pink-400/10'
        },
        {
            icon: 'Shield',
            title: 'Seguridad Primero',
            description: 'Evita retos peligrosos, ilegales o que pongan en riesgo la salud física o mental',
            color: 'text-yellow-400',
            bg: 'bg-yellow-400/10'
        },
        {
            icon: 'Users',
            title: 'Inclusividad',
            description: 'Crea retos que puedan disfrutar personas de diferentes personalidades y comodidades',
            color: 'text-blue-400',
            bg: 'bg-blue-400/10'
        },
        {
            icon: 'Lightbulb',
            title: 'Creatividad Original',
            description: 'Aporta ideas únicas y originales que no se encuentren ya en el juego',
            color: 'text-purple-400',
            bg: 'bg-purple-400/10'
        }
    ];

    return (
        // 👇 CAMBIO PRINCIPAL: Fondo negro profundo y bordes sutiles
        <div className="bg-gray-900 rounded-2xl p-6 border border-white/10 shadow-xl">

            {/* ENCABEZADO */}
            <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <Icon name="BookOpen" size={24} className="text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-white">
                    Guías de la Comunidad
                </h3>
            </div>

            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Para mantener Kamikaze divertido y seguro para todos, sigue estas pautas al proponer nuevos retos:
            </p>

            {/* LISTA DE GUÍAS */}
            <div className="space-y-4">
                {guidelines.map((guideline, index) => (
                    <div
                        key={index}
                        className="flex items-start space-x-4 p-4 rounded-xl bg-gray-800/30 border border-white/5 hover:bg-gray-800/50 transition-colors"
                    >
                        {/* Icono con fondo de color */}
                        <div className={`p-2 rounded-lg flex-shrink-0 ${guideline.bg} ${guideline.color}`}>
                            <Icon name={guideline.icon} size={20} />
                        </div>

                        {/* Textos */}
                        <div className="flex-1">
                            <h4 className="font-bold text-white text-sm mb-1">
                                {guideline.title}
                            </h4>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                {guideline.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* FOOTER: PROCESO DE REVISIÓN */}
            <div className="mt-6 p-4 bg-gray-800/50 rounded-xl border border-white/10">
                <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Star" size={18} className="text-cyan-400" />
                    <span className="font-bold text-sm text-cyan-100">
                        Proceso de Revisión
                    </span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                    Todos los retos propuestos pasan por un proceso de revisión para garantizar que cumplan con nuestras pautas de comunidad antes de ser añadidos al juego.
                </p>
            </div>
        </div>
    );
};

export default CommunityGuidelinesSection;