import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

// Generador de baraja simple
const SUITS = ['♠', '♥', '♦', '♣'];
const VALUES = [
    { label: 'A', val: 1 }, { label: '2', val: 2 }, { label: '3', val: 3 },
    { label: '4', val: 4 }, { label: '5', val: 5 }, { label: '6', val: 6 },
    { label: '7', val: 7 }, { label: '8', val: 8 }, { label: '9', val: 9 },
    { label: '10', val: 10 }, { label: 'J', val: 11 }, { label: 'Q', val: 12 }, { label: 'K', val: 13 }
];

/**
 * Minijuego "Cartas del Destino" (Mayor o Menor).
 * El jugador debe adivinar si la siguiente carta será de mayor o menor valor.
 * Si acierta, acumula racha. Si falla, bebe el equivalente a su racha + 1.
 * 
 * @param {Object} props
 * @param {Function} props.onClose - Función para cerrar el minijuego.
 */
const HighLowCardMinigame = ({ currentPlayer, onClose }) => {
    const [currentCard, setCurrentCard] = useState(null);
    const [turnsLeft, setTurnsLeft] = useState(10);
    const [drinks, setDrinks] = useState(0);
    const [status, setStatus] = useState('PLAYING'); // 'PLAYING', 'FINISHED'
    const [message, setMessage] = useState('¿La siguiente es MAYOR o MENOR?');

    // Inicializar primera carta
    useEffect(() => {
        drawNewCard();
    }, []);

    /**
     * Genera una carta aleatoria con palo, valor, etiqueta y color.
     */
    const getRandomCard = () => {
        const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
        const valueData = VALUES[Math.floor(Math.random() * VALUES.length)];
        const color = (suit === '♥' || suit === '♦') ? 'text-red-500' : 'text-gray-900';
        return { ...valueData, suit, color };
    };

    /**
     * Saca una nueva carta inicial.
     */
    const drawNewCard = () => {
        setCurrentCard(getRandomCard());
    };

    /**
     * Maneja la adivinanza del jugador.
     */
    const handleGuess = (guess) => {
        if (status !== 'PLAYING') return;

        let nextCard = getRandomCard();

        // Evitar empates aburridos
        while (nextCard.val === currentCard.val) {
            nextCard = getRandomCard();
        }

        const isHigher = nextCard.val > currentCard.val;
        const isLower = nextCard.val < currentCard.val;

        let won = false;
        if (guess === 'HIGH' && isHigher) won = true;
        if (guess === 'LOW' && isLower) won = true;

        setCurrentCard(nextCard);

        let newDrinks = drinks;
        if (!won) {
            newDrinks += 1;
            setDrinks(newDrinks);
            setMessage(`¡FALLASTE! Salió ${nextCard.label} ${nextCard.suit}`);
        } else {
            setMessage('¡ACERTASTE!');
        }

        const newTurns = turnsLeft - 1;
        setTurnsLeft(newTurns);

        if (newTurns <= 0) {
            setStatus('FINISHED');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center bg-gray-900 p-4">
            {/* HEADER */}
            <div className="w-full flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <Icon name="Layers" className="text-purple-400" />
                    <span className="font-bold text-white">Cartas del Destino</span>
                </div>
                {/* No cerramos prematuramente, deben terminar sus 10 turnos */}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm">

                {/* MARCADOR */}
                <div className="mb-6 flex space-x-4">
                    <div className="bg-gray-800 px-6 py-2 rounded-full border border-white/10">
                        <span className="text-gray-400 text-sm uppercase mr-2">Turnos:</span>
                        <span className="text-2xl font-black text-white">{turnsLeft}</span>
                    </div>
                    <div className="bg-gray-800 px-6 py-2 rounded-full border border-white/10">
                        <span className="text-gray-400 text-sm uppercase mr-2">Tragos:</span>
                        <span className="text-2xl font-black text-red-500">{drinks}</span>
                    </div>
                </div>

                {/* CARTA GIGANTE */}
                <div className="relative w-64 h-96 mb-8 perspective-1000">
                    <AnimatePresence mode='wait'>
                        {currentCard && (
                            <motion.div
                                key={currentCard.val + currentCard.suit + turnsLeft} // Animamos el cambio en cada turno
                                initial={{ rotateY: 90, opacity: 0 }}
                                animate={{ rotateY: 0, opacity: 1 }}
                                exit={{ rotateY: -90, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="w-full h-full bg-white rounded-3xl shadow-[0_0_30px_rgba(255,255,255,0.1)] flex flex-col justify-between p-6 border-4 border-gray-200"
                            >
                                <div className={`text-4xl font-bold ${currentCard.color} text-left`}>
                                    {currentCard.label}<br />{currentCard.suit}
                                </div>
                                <div className={`text-9xl flex justify-center items-center ${currentCard.color}`}>
                                    {currentCard.suit}
                                </div>
                                <div className={`text-4xl font-bold ${currentCard.color} text-right rotate-180`}>
                                    {currentCard.label}<br />{currentCard.suit}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* CONTROLES O RESULTADO */}
                {status === 'PLAYING' ? (
                    <div className="w-full space-y-4">
                        <p className="text-center text-white font-medium min-h-[1.5rem]">{message}</p>
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                onClick={() => handleGuess('LOW')}
                                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 py-6 text-xl"
                            >
                                👇 MENOR
                            </Button>
                            <Button
                                onClick={() => handleGuess('HIGH')}
                                className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50 py-6 text-xl"
                            >
                                MAYOR 👆
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center w-full">
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1.1 }}
                            className="mb-6 bg-gray-800 p-6 rounded-2xl border-2 border-red-500/50"
                        >
                            <h2 className="text-3xl font-black text-red-400 mb-2">¡RONDA TERMINADA!</h2>
                            <p className="text-xl text-white">
                                {drinks === 0 
                                    ? '¡Increíble! Adivinaste todas. Te salvaste.' 
                                    : <>Te toca beber <span className="text-yellow-400 font-bold text-4xl mx-2">{drinks}</span> tragos.</>}
                            </p>
                        </motion.div>
                        <Button onClick={onClose} className="w-full py-4 text-lg bg-cyan-600 hover:bg-cyan-500">
                            Finalizar Minijuego
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HighLowCardMinigame;