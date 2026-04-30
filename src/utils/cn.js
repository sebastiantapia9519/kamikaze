import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utilidad para fusionar clases de Tailwind CSS de manera segura,
 * resolviendo conflictos de especificidad.
 * Combina `clsx` para agrupación condicional y `twMerge` para eliminar duplicados/conflictos.
 * 
 * @param {...(string|Object|Array)} inputs - Clases a combinar (strings, objetos, arreglos condicionales).
 * @returns {string} String final con las clases procesadas y unificadas.
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}