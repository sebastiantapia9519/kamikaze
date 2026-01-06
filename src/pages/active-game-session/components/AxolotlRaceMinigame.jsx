import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

// Importamos los SVGs que acabamos de crear (Asegúrate de que la ruta sea correcta)
import {
    AjoloteRosaSVG,
    AjoloteAzulSVG,
    AjoloteDoradoSVG,
    AjoloteVerdeSVG,
    AjoloteRojoSVG
} from '../../../components/ui/AjoloteSvgs';

const AxolotlRaceMinigame = ({ players, onClose }) => {
    // Definimos los corredores aquí, ya no en el archivo principal
    const racers = useMemo(() => [
        { id: 'ajolote-rosa', name: 'Ajolote Rosa', Component: AjoloteRosaSVG },
        { id: 'ajolote-azul', name: 'Ajolote Azul', Component: AjoloteAzulSVG },
        { id: 'ajolote-dorado', name: 'Ajolote Dorado', Component: AjoloteDoradoSVG },
        { id: 'ajolote-verde', name: 'Ajolote Verde', Component: AjoloteVerdeSVG },
        { id: 'ajolote-rojo', name: 'Ajolote Rojo', Component: AjoloteRojoSVG },
    ], []);

    // Estado interno del minijuego (ya no ensucia el estado global)
    const [bets, setBets] = useState({});
    const [phase, setPhase] = useState('betting'); // 'betting', 'racing', 'results'
    const [positions, setPositions] = useState({});
    const [winner, setWinner] = useState(null);

    // Lógica de apuestas
    const handleBetChange = (playerName, partialBet) => {
        setBets(prev => ({ ...prev, [playerName]: { ...(prev[playerName] || {}), ...partialBet } }));
    };
    const isBettingComplete = players.every(p => bets[p.name]?.racerId && bets[p.name]?.amount > 0);

    // Iniciar carrera
    const handleStartRace = () => {
        setPositions(racers.reduce((acc, racer) => ({ ...acc, [racer.id]: 0 }), {}));
        setWinner(null);
        setPhase('racing');
    };

    // Lógica de la carrera (useEffect)
    useEffect(() => {
        if (phase !== 'racing' || winner) return;

        const raceInterval = setInterval(() => {
            setPositions(prev => {
                const newPositions = { ...prev };
                let winnerFound = false;

                for (const racer of racers) {
                    if (winnerFound) continue;

                    const current = newPositions[racer.id] || 0;
                    if (current < 100) {
                        // Velocidad aleatoria
                        newPositions[racer.id] = current + (Math.random() * 5 + 1);
                    }

                    if (newPositions[racer.id] >= 100) {
                        newPositions[racer.id] = 100;
                        winnerFound = true;
                        setWinner(racer);
                        clearInterval(raceInterval);
                        setTimeout(() => setPhase('results'), 1500);
                    }
                }
                return newPositions;
            });
        }, 200);

        return () => clearInterval(raceInterval);
    }, [phase, winner, racers]);

    return (
        <motion.div className="fixed inset-0 bg-background/90 backdrop-blur-lg flex items-center justify-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AnimatePresence mode="wait">

                {/* FASE 1: APUESTAS */}
                {phase === 'betting' && (
                    <motion.div key="betting" className="bg-card/90 border border-border/50 rounded-lg shadow-graffiti-lg max-w-2xl w-full text-center p-6 sm:p-8 flex flex-col" initial={{ scale: 0.7 }} animate={{ scale: 1 }} exit={{ scale: 0.7, opacity: 0 }}>
                        <div className="flex-shrink-0"><Icon name="Gamepad2" size={40} className="text-primary mx-auto mb-4" /><h2 className="font-heading text-3xl text-primary mb-2">¡Carrera de Ajolotes!</h2><p className="text-text-secondary mb-4">Cada jugador elija un campeón y apueste sus tragos.</p></div>
                        <div className="flex justify-center items-center gap-4 mb-6 flex-wrap">{racers.map(racer => (<div key={racer.id} className="flex flex-col items-center"><racer.Component size={28} /><span className="text-xs text-text-secondary mt-1">{racer.name.split(' ')[1]}</span></div>))}</div>
                        <div className="flex-grow space-y-4 text-left mb-8 pr-2 -mr-2 overflow-y-auto max-h-72">{players.map(player => { const currentBet = bets[player.name]; return (<div key={player.id || player.name} className="bg-surface/50 p-3 rounded-lg"><span className="font-semibold text-text-primary mb-2 block">{player.name} apuesta:</span><div className="flex items-center gap-3"><div className="flex-grow flex justify-around items-center bg-background/50 p-2 rounded-md">{racers.map(racer => (<motion.button key={racer.id} onClick={() => handleBetChange(player.name, { racerId: racer.id })} className={`p-1 rounded-full transition-all duration-200 ${currentBet?.racerId === racer.id ? 'bg-primary/20 ring-2 ring-primary' : 'bg-transparent'}`} whileTap={{ scale: 0.9 }}><racer.Component size={32} /></motion.button>))}</div><div className="flex-shrink-0 w-24"><input type="number" min="1" placeholder="Tragos" className="bg-background border border-border rounded px-2 py-2 w-full text-sm text-center h-full" onChange={(e) => handleBetChange(player.name, { amount: parseInt(e.target.value, 10) || 0 })} /></div></div></div>); })}</div>
                        <div className="flex-shrink-0"><Button onClick={handleStartRace} size="lg" className="w-full disabled:bg-muted disabled:shadow-none disabled:cursor-not-allowed" disabled={!isBettingComplete}>¡Que comience la carrera!</Button><Button onClick={onClose} variant="ghost" className="mt-2 text-text-secondary">Saltar minijuego</Button></div>
                    </motion.div>
                )}

                {/* FASE 2: CARRERA */}
                {phase === 'racing' && (
                    <motion.div key="racing" className="bg-card/90 border border-border/50 rounded-lg shadow-graffiti-lg max-w-2xl w-full p-6 sm:p-8" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                        <h2 className="font-heading text-3xl text-primary mb-6 text-center">¡La carrera está en curso!</h2>
                        <div className="relative space-y-2 mt-8">
                            {racers.map((racer) => (
                                <div key={racer.id} className="relative h-10 w-full bg-surface/50 rounded-full overflow-hidden flex items-center shadow-inner text-white">
                                    <div className="absolute z-10" style={{ left: `${positions[racer.id] || 0}%`, transform: 'translateX(-100%)', transition: 'left 0.2s linear' }}>
                                        <racer.Component size={32} />
                                    </div>
                                </div>
                            ))}
                            <div className="absolute top-0 bottom-0 right-0 w-2 bg-gradient-to-b from-primary to-accent rounded-full opacity-70 z-0"></div>
                        </div>
                    </motion.div>
                )}

                {/* FASE 3: RESULTADOS */}
                {phase === 'results' && winner && (
                    <motion.div key="results" className="bg-card/90 border border-border/50 rounded-lg shadow-graffiti-lg max-w-2xl w-full text-center p-6 sm:p-8 flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="flex-shrink-0">
                            <winner.Component size={40} className="mx-auto mb-4" />
                            <h2 className="font-heading text-3xl text-secondary mb-2">¡Ganó el {winner.name}!</h2>
                        </div>
                        <div className="flex-grow space-y-4 text-left my-8 overflow-y-auto max-h-72">
                            {(() => {
                                const anyPlayerWon = players.some(p => bets[p.name]?.racerId === winner.id);
                                return (
                                    <>
                                        {!anyPlayerWon ? (
                                            <div className="text-center p-3 mb-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                                                <h3 className="font-semibold text-destructive text-lg">¡Nadie le atinó!</h3>
                                                <p className="text-text-secondary text-sm">Todos toman la mitad de lo que apostaron.</p>
                                            </div>
                                        ) : (
                                            <h3 className="font-semibold text-text-primary text-lg text-center">Resultados de las Apuestas:</h3>
                                        )}
                                        {players.map(player => {
                                            const bet = bets[player.name];
                                            const didWin = bet?.racerId === winner.id;
                                            const sipsToTake = Math.ceil((bet?.amount || 0) / 2);
                                            return (
                                                <div key={player.name} className={`p-3 rounded-lg flex justify-between items-center text-sm ${didWin ? 'bg-success/20' : 'bg-destructive/10'}`}>
                                                    <span className="font-medium text-text-primary">{player.name}</span>
                                                    {didWin ? (
                                                        <span className="font-semibold text-success">🏆 Reparte {bet.amount * 2} tragos</span>
                                                    ) : (
                                                        !anyPlayerWon ? (
                                                            <span className="font-semibold text-destructive">🍺 Toma {sipsToTake} {sipsToTake === 1 ? 'trago' : 'tragos'}</span>
                                                        ) : (
                                                            <span className="text-text-secondary">Apostó {bet.amount} por el {racers.find(r => r.id === bet?.racerId)?.name.split(' ')[1] || '...'}</span>
                                                        )
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </>
                                );
                            })()}
                        </div>
                        <div className="flex-shrink-0">
                            <Button onClick={onClose} size="lg" className="w-full">Continuar Juego</Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default AxolotlRaceMinigame;