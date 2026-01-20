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

const HighLowCardMinigame = ({ onClose }) => {
    const [currentCard, setCurrentCard] = useState(null);
    const [score, setScore] = useState(0); // Racha actual
    const [status, setStatus] = useState('PLAYING'); // 'PLAYING', 'WIN', 'LOSE'
    const [message, setMessage] = useState('¿La siguiente es MAYOR o MENOR?');

    // Inicializar primera carta
    useEffect(() => {
        drawNewCard();
    }, []);

    const getRandomCard = () => {
        const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
        const valueData = VALUES[Math.floor(Math.random() * VALUES.length)];
        const color = (suit === '♥' || suit === '♦') ? 'text-red-500' : 'text-gray-900';
        return { ...valueData, suit, color };
    };

    const drawNewCard = () => {
        setCurrentCard(getRandomCard());
    };

    const handleGuess = (guess) => { // 'HIGH' or 'LOW'
        const nextCard = getRandomCard();

        // Evitar empates aburridos (si sale igual, sacamos otra hasta que sea diferente)
        // Opcional: Dejar el empate como "nadie bebe". Aquí lo forzamos a ser diferente para que fluya.
        while (nextCard.val === currentCard.val) {
            nextCard.val = VALUES[Math.floor(Math.random() * VALUES.length)].val;
        }

        const isHigher = nextCard.val > currentCard.val;
        const isLower = nextCard.val < currentCard.val;

        let won = false;
        if (guess === 'HIGH' && isHigher) won = true;
        if (guess === 'LOW' && isLower) won = true;

        setCurrentCard(nextCard); // Mostramos la nueva carta

        if (won) {
            setScore(score + 1);
            setMessage('¡Bien! Pasa el cel o sigue arriesgando.');
            // Animación de éxito sutil
        } else {
            setStatus('LOSE');
            setMessage(`¡FALLASTE! Salió ${nextCard.label} ${nextCard.suit}`);
        }
    };

    const resetGame = () => {
        setScore(0);
        setStatus('PLAYING');
        setMessage('¿La siguiente es MAYOR o MENOR?');
        drawNewCard();
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center bg-gray-900 p-4">
            {/* HEADER */}
            <div className="w-full flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <Icon name="Layers" className="text-purple-400" />
                    <span className="font-bold text-white">Cartas del Destino</span>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-white">
                    <Icon name="X" size={24} />
                </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm">

                {/* MARCADOR DE RACHA */}
                <div className="mb-6 bg-gray-800 px-6 py-2 rounded-full border border-white/10">
                    <span className="text-gray-400 text-sm uppercase mr-2">Racha Segura:</span>
                    <span className="text-2xl font-black text-green-400">{score}</span>
                </div>

                {/* CARTA GIGANTE */}
                <div className="relative w-64 h-96 mb-8 perspective-1000">
                    <AnimatePresence mode='wait'>
                        {currentCard && (
                            <motion.div
                                key={currentCard.val + currentCard.suit + score} // Key única para animar cambio
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
                        {score > 0 && (
                            <button
                                onClick={resetGame}
                                className="w-full text-gray-500 text-sm hover:text-white underline mt-4"
                            >
                                Retirarse y pasar turno (Guardar {score})
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="text-center w-full">
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1.1 }}
                            className="mb-6"
                        >
                            <h2 className="text-5xl font-black text-red-500 mb-2">¡PERDISTE!</h2>
                            <p className="text-xl text-white">
                                Te toca beber <span className="text-yellow-400 font-bold text-3xl">{score + 1}</span> tragos.
                            </p>
                            <p className="text-gray-400 text-sm mt-1">(Tu racha + el castigo)</p>
                        </motion.div>
                        <Button onClick={resetGame} className="w-full py-4 text-lg">
                            Siguiente Víctima
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HighLowCardMinigame;