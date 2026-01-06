import React from 'react';
import Icon from '../../../components/AppIcon';

const ResponsibleDrinkingReminder = () => {
    return (
        // CONTENEDOR PRINCIPAL
        // bg-gray-900: Fondo oscuro sólido (igual que la tarjeta PWA).
        // rounded-2xl: Bordes muy redondeados.
        // border-white/10: Borde sutil blanco semitransparente.
        // overflow-hidden: Evita que los adornos internos se salgan del borde.
        <div className="bg-gray-900 rounded-2xl p-6 border border-white/10 shadow-xl relative overflow-hidden">

            {/* DECORACIÓN DE FONDO (Mancha de luz) */}
            {/* Es un círculo difuminado (blur-3xl) en la esquina superior derecha */}
            {/* pointer-events-none: Para que no interfiera con los clicks */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10" />

            {/* CONTENIDO REAL (z-10 para que quede encima de la decoración) */}
            <div className="relative z-10">

                {/* ENCABEZADO: Icono + Título */}
                <div className="flex items-center space-x-3 mb-4">
                    {/* Caja del icono con fondo amarillo transparente */}
                    <div className="p-3 bg-yellow-500/20 rounded-lg">
                        <Icon name="AlertTriangle" className="text-yellow-400" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-yellow-400">Consumo Responsable</h3>
                </div>

                {/* TEXTO DE INTRODUCCIÓN */}
                {/* leading-relaxed: Aumenta el espacio entre líneas para leer mejor */}
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    Kamikaze está diseñado para la diversión, pero tu seguridad y bienestar son lo más importante. Recuerda siempre:
                </p>

                {/* LISTA DE CONSEJOS */}
                <ul className="space-y-3">
                    {/* Array con los textos para no repetir código 5 veces */}
                    {[
                        "Conoce tus límites y respétalos siempre",
                        "Mantente hidratado bebiendo agua regularmente",
                        "Come antes y durante el juego",
                        "Nunca conduzcas después de beber",
                        "Cuida de tus amigos y pide ayuda si es necesario"
                    ].map((item, idx) => (
                        // Renderizamos cada punto de la lista
                        <li key={idx} className="flex items-start space-x-3 text-sm text-gray-400">
                            {/* Icono de check verde fijo (flex-shrink-0 evita que se aplaste) */}
                            <Icon name="Check" size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>

                {/* SECCIÓN FINAL: Advertencia legal +18 */}
                {/* border-t: Línea separadora arriba */}
                <div className="mt-6 pt-4 border-t border-white/10">
                    {/* Caja roja de advertencia */}
                    <div className="flex items-center p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <Icon name="Shield" size={20} className="text-red-400 mr-3 flex-shrink-0" />
                        <p className="text-xs text-red-300 font-medium">
                            Solo para mayores de 18 años. Si sientes que el alcohol está afectando tu vida, busca ayuda profesional.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResponsibleDrinkingReminder;