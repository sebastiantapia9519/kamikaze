import { useCallback } from 'react';

// Si usas Vite y el archivo está en public, usaremos rutas absolutas.
// Si prefieres importarlo: import whooshSfx from '../assets/sounds/whoosh.mp3';

export const useGameEffects = () => {

    // Función auxiliar para leer la config en tiempo real
    const getSettings = () => {
        try {
            const saved = localStorage.getItem('kamikazeGameplaySettings');
            // Si no existe, valores por defecto (true)
            return saved ? JSON.parse(saved) : { enableSounds: true, enableVibration: true };
        } catch (e) {
            return { enableSounds: true, enableVibration: true };
        }
    };

    // 📳 VIBRACIÓN
    const triggerHaptic = useCallback((pattern = 10) => {
        const { enableVibration } = getSettings();

        // Verificamos si el navegador soporta vibración y si el usuario la activó
        if (enableVibration && typeof navigator !== 'undefined' && navigator.vibrate) {
            // 10ms es un "tic" muy sutil, como un teclado de iPhone
            // 50ms es más notorio
            navigator.vibrate(pattern);
        }
    }, []);

    // 🔊 SONIDO
    const playSound = useCallback((soundType = 'whoosh') => {
        const { enableSounds } = getSettings();

        if (!enableSounds) return;

        // Aquí definimos los sonidos disponibles
        // Asegúrate de poner el archivo .mp3 en tu carpeta public/sounds/
        let audioFile = '/sounds/whoosh.mp3';

        if (soundType === 'click') audioFile = '/sounds/click.mp3';
        // Agrega más tipos si quieres

        const audio = new Audio(audioFile);
        audio.volume = 0.5; // Volumen al 50% para no aturdir (como pediste "no muy ruidoso")
        audio.play().catch(e => console.error("Error reproduciendo audio:", e));
    }, []);

    return { triggerHaptic, playSound };
};