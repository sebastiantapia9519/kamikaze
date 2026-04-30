import React from 'react';
import * as LucideIcons from 'lucide-react';
import { HelpCircle } from 'lucide-react';

/**
 * Componente contenedor genérico para los iconos de la aplicación (usando lucide-react).
 * Si el icono solicitado no existe, muestra un icono de ayuda por defecto en lugar de romper la app.
 * 
 * @param {Object} props
 * @param {string} props.name - Nombre del icono en PascalCase (ej. 'ArrowRight', 'CheckCircle').
 * @param {number|string} [props.size=24] - Tamaño del icono en píxeles.
 * @param {string} [props.color='currentColor'] - Color del icono (puede ser una clase Tailwind o valor HEX).
 * @param {string} [props.className=''] - Clases CSS adicionales.
 * @param {number} [props.strokeWidth=2] - Grosor del trazo del icono.
 */
function Icon({
    name,
    size = 24,
    color = "currentColor",
    className = "",
    strokeWidth = 2,
    ...props
}) {
    const IconComponent = LucideIcons?.[name];

    if (!IconComponent) {
        return <HelpCircle size={size} color="gray" strokeWidth={strokeWidth} className={className} {...props} />;
    }

    return <IconComponent
        size={size}
        color={color}
        strokeWidth={strokeWidth}
        className={className}
        {...props}
    />;
}
export default Icon;