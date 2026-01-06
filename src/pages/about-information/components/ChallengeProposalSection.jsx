import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChallengeProposalSection = () => {
    return (
        // CONTENEDOR PRINCIPAL
        // bg-gray-900: Fondo oscuro sólido (igual que la tarjeta PWA).
        // rounded-2xl: Bordes muy redondeados.
        // border-white/10: Borde sutil blanco semitransparente.
        // shadow-xl: Sombra pronunciada para dar profundidad.
        <div className="bg-gray-900 rounded-2xl p-8 border border-white/10 shadow-xl text-center relative overflow-hidden">

            {/* DECORACIÓN: Degradado suave desde arriba (púrpura muy bajito) */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none" />

            {/* CONTENIDO CENTRADO (z-10 para estar sobre el fondo) */}
            <div className="relative z-10 flex flex-col items-center">

                {/* ICONO GRANDE CIRCULAR */}
                {/* bg-purple-500/20: Círculo traslúcido morado */}
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                    <Icon name="Zap" size={32} className="text-purple-400" />
                </div>

                {/* TÍTULO Y SUBTÍTULO */}
                <h2 className="text-2xl font-black text-white mb-2">
                    ¿Tienes una idea malvada?
                </h2>

                <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
                    Envía tus mejores retos para que aparezcan en la próxima actualización.
                    Tu creatividad (y crueldad) es bienvenida.
                </p>

                {/* BOTÓN DE ACCIÓN CON TU LINK */}
                {/* Al hacer click, abre tu Google Forms en una pestaña nueva */}
                <Button
                    className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-purple-900/20 transition-all transform hover:scale-105"
                    onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSdh8UgeB7FeJ8oH1MrXoAAnJItzh572sRPuLkghbR8xUvkWFg/viewform?usp=dialog', '_blank')}
                >
                    <div className="flex items-center space-x-2">
                        <Icon name="Plus" size={20} />
                        <span>Proponer un Reto</span>
                    </div>
                </Button>

                {/* PIE DE TARJETA: Iconos informativos pequeños */}
                <div className="mt-6 flex items-center justify-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center"><Icon name="Clock" size={12} className="mr-1" /> 2 minutos</span>
                    <span className="flex items-center"><Icon name="Globe" size={12} className="mr-1" /> Comunidad global</span>
                    <span className="flex items-center"><Icon name="Heart" size={12} className="mr-1" /> Gratis</span>
                </div>
            </div>
        </div>
    );
};

export default ChallengeProposalSection;