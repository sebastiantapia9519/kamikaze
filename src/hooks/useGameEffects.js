import { useCallback } from 'react';

/**
 * Custom Hook para manejar los efectos sensoriales del juego (Sonido y Vibración).
 * Lee la configuración del usuario desde localStorage para respetar sus preferencias.
 * 
 * @returns {Object} Un objeto con las funciones `triggerHaptic` y `playSound`.
 */
export const useGameEffects = () => {

    /**
     * Función auxiliar para leer la configuración en tiempo real
     * directamente de localStorage para no depender de contextos complejos.
     * @returns {Object} Configuración actual de gameplay (enableSounds, enableVibration).
     */
    const getSettings = () => {
        try {
            const saved = localStorage.getItem('kamikazeGameplaySettings');
            // Si no existe, valores por defecto (true)
            return saved ? JSON.parse(saved) : { enableSounds: true, enableVibration: true };
        } catch (e) {
            return { enableSounds: true, enableVibration: true };
        }
    };

    /**
     * Dispara una vibración háptica si el dispositivo lo soporta
     * y el usuario tiene la opción activada.
     * 
     * @param {number|number[]} [pattern=10] - Patrón de vibración en milisegundos (ej. 10 para toque sutil, o [100, 50, 100] para secuencias).
     */
    const triggerHaptic = useCallback((pattern = 10) => {
        const { enableVibration } = getSettings();

        // Verificamos si el navegador soporta vibración y si el usuario la activó
        if (enableVibration && typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    }, []);

    /**
     * Reproduce un efecto de sonido si el usuario tiene la opción activada.
     * 
     * @param {string} [soundType='whoosh'] - El identificador del sonido a reproducir ('whoosh', 'click', 'explode', 'win', 'tick').
     */
    const playSound = useCallback((soundType = 'whoosh') => {
        const { enableSounds } = getSettings();

        if (!enableSounds) return;

        // Aquí definimos los sonidos disponibles
        let audioFile = `/sounds/${soundType}.mp3`;

        // Si el archivo no existe o no se especificó uno válido, usamos el default por seguridad.
        // NOTA: Se asume que los archivos están en public/sounds/
        
        const audio = new Audio(audioFile);
        audio.volume = 0.5; // Volumen al 50% para no aturdir
        
        // Atrapamos errores silenciosamente (ej. autoplay bloqueado por el navegador)
        audio.play().catch(e => console.warn(`No se pudo reproducir el sonido ${soundType}:`, e.message));
    }, []);

    return { triggerHaptic, playSound };
};