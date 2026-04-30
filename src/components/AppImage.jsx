import React from 'react';

/**
 * Componente contenedor genérico para imágenes.
 * Incorpora un manejador de errores por defecto: si la imagen original no se puede cargar,
 * mostrará una imagen de "no image" genérica en su lugar.
 * 
 * @param {Object} props
 * @param {string} props.src - URL de origen de la imagen.
 * @param {string} [props.alt='Image Name'] - Texto alternativo para accesibilidad y en caso de que falle la carga (antes de mostrar el fallback).
 * @param {string} [props.className=''] - Clases CSS adicionales.
 */
function Image({
    src,
    alt = "Image Name",
    className = "",
    ...props
}) {

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={(e) => {
                e.target.src = "/assets/images/no_image.png"
            }}
            {...props}
        />
    );
}

export default Image;
