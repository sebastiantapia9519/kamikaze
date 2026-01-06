import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FingerRouletteMinigame = ({ onClose }) => {
    const [touches, setTouches] = useState({});
    const [gameState, setGameState] = useState('waiting'); // waiting, choosing, result
    const [loserId, setLoserId] = useState(null);
    const containerRef = useRef(null);
    const timerRef = useRef(null);

    // Manejo de toques (Multitouch real)
    const handleTouch = (e) => {
        if (gameState === 'result') return;

        // Prevenir scroll y zoom
        e.preventDefault();

        const newTouches = {};
        const touchList = e.touches;

        for (let i = 0; i < touchList.length; i++) {
            const t = touchList[i];
            newTouches[t.identifier] = {
                id: t.identifier,
                x: t.clientX,
                y: t.clientY,
                color: getColor(t.identifier)
            };
        }

        setTouches(newTouches);
        checkGameStatus(Object.keys(newTouches).length);
    };

    // Lógica para asignar colores consistentes
    const getColor = (id) => {
        const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#ec4899'];
        return colors[id % colors.length];
    };

    const checkGameStatus = (count) => {
        // Si hay 2 o más dedos y no estamos eligiendo, iniciar conteo
        if (count >= 2 && gameState === 'waiting') {
            if (timerRef.current) clearTimeout(timerRef.current);

            // Esperar 3 segundos estables para elegir
            setGameState('choosing');
            timerRef.current = setTimeout(() => {
                pickLoser();
            }, 3000);
        }
        // Si alguien quita el dedo antes de tiempo
        else if (count < 2 && gameState === 'choosing') {
            if (timerRef.current) clearTimeout(timerRef.current);
            setGameState('waiting');
        }
    };

    const pickLoser = () => {
        // Obtenemos los IDs actuales directamente del estado ref o actual
        // (Nota: en closures de setTimeout, es mejor usar ref, pero aquí simplificamos con un truco visual)
        setGameState('result');

        // Seleccionar uno al azar
        const currentTouchIds = Object.keys(touches); // Esto puede estar desactualizado en el closure, pero react actualiza rápido
        // Truco: Forzamos la lectura de los toques actuales visualmente
        const ids = document.querySelectorAll('.finger-indicator');
        if (ids.length > 0) {
            const randomIdx = Math.floor(Math.random() * ids.length);
            const selectedId = ids[randomIdx].dataset.touchid; // Usamos data attribute
            setLoserId(Number(selectedId));
        }
    };

    // Prevenir menú contextual (click derecho en móviles)
    useEffect(() => {
        const prevent = (e) => e.preventDefault();
        document.addEventListener('contextmenu', prevent);
        return () => document.removeEventListener('contextmenu', prevent);
    }, []);

    return (
        <motion.div
            ref={containerRef}
            className="fixed inset-0 z-50 bg-black/95 touch-none select-none flex flex-col items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            onTouchStart={handleTouch}
            onTouchMove={handleTouch}
            onTouchEnd={handleTouch}
        >
            {/* UI DE FONDO */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {gameState === 'waiting' && (
                    <div className="text-center opacity-50 animate-pulse">
                        <Icon name="Hand" size={64} className="mx-auto mb-4 text-gray-400" />
                        <h2 className="text-2xl font-bold text-white">PONGAN SUS DEDOS</h2>
                        <p className="text-gray-400">Mínimo 2 jugadores</p>
                    </div>
                )}

                {gameState === 'choosing' && (
                    <div className="text-center">
                        <h2 className="text-4xl font-black text-cyan-400 animate-bounce">ESPEREN...</h2>
                    </div>
                )}

                {gameState === 'result' && (
                    <div className="bg-gray-900/90 p-8 rounded-2xl text-center z-50 pointer-events-auto border-2 border-red-500">
                        <h2 className="text-3xl font-black text-white mb-2">¡TENEMOS PERDEDOR!</h2>
                        <p className="text-red-400 text-xl font-bold mb-6">El dedo seleccionado bebe 2 tragos</p>
                        <Button onClick={onClose} size="lg" className="w-full">Terminar</Button>
                    </div>
                )}
            </div>

            {/* CIRCULOS DE LOS DEDOS */}
            {Object.values(touches).map((touch) => (
                <motion.div
                    key={touch.id}
                    data-touchid={touch.id}
                    className={`finger-indicator absolute rounded-full flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 pointer-events-none
                        ${gameState === 'result' && Number(touch.id) !== loserId ? 'opacity-20' : 'opacity-100'}
                    `}
                    initial={{ scale: 0 }}
                    animate={{
                        scale: gameState === 'result' && Number(touch.id) === loserId ? 1.5 : 1,
                        x: touch.x,
                        y: touch.y
                    }}
                    style={{
                        width: 100,
                        height: 100,
                        backgroundColor: touch.color,
                        boxShadow: `0 0 30px ${touch.color}`
                    }}
                >
                    {gameState === 'choosing' && (
                        <div className="w-full h-full border-4 border-white/50 rounded-full animate-spin border-t-transparent" />
                    )}
                    {gameState === 'result' && Number(touch.id) === loserId && (
                        <span className="text-4xl">💀</span>
                    )}
                </motion.div>
            ))}
        </motion.div>
    );
};

export default FingerRouletteMinigame;