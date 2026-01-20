/**
 * @file ActiveGameSession.js
 * @description Vista principal. Lógica movida a hooks/useActiveGame.js
 */

// 👇 1. Agregamos useEffect aquí
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// --- LOGIC HOOK ---
import { useActiveGame } from '../../hooks/useActiveGame';
// 👇 2. Importamos el hook de efectos de sonido/vibración
import { useGameEffects } from '../../hooks/useGameEffects';

// --- COMPONENTS ---
import ChallengeCard from './components/ChallengeCard';
import GameControls from './components/GameControls';
import GameCompletionModal from './components/GameCompletionModal';
import PlayerTurnIndicator from './components/PlayerTurnIndicator';
import ChaosRouletteModal from './components/ChaosRouletteModal';
import Icon from '../../components/AppIcon';
import kamikazeLogo from '../../assets/images/iconKamikaze180x180.png';

// --- MINIGAMES ---
import AxolotlRaceMinigame from './components/AxolotlRaceMinigame';
import TimeBombMinigame from './components/TimeBombMinigame';
import BlindSniperMinigame from './components/BlindSniperMinigame';
import FingerRouletteMinigame from './components/FingerRouletteMinigame';
import TapBattleMinigame from './components/TapBattleMinigame';
import HighLowCardMinigame from './components/HighLowCardMinigame';
import ToxicSequenceMinigame from './components/ToxicSequenceMinigame';
import TrafficLightMinigame from './components/TrafficLightMinigame';

// --- ASSETS ---
import bgImage from '../../assets/images/graffiti-bg.png';

const ActiveGameSession = () => {
    const location = useLocation();

    // Invocamos el Hook de lógica del juego
    const {
        state,
        totalChallenges,
        currentPlayer,
        currentChallengeData,
        isLastChallenge,
        actions
    } = useActiveGame(location.state);

    // 👇 3. Invocamos el Hook de efectos
    const { playSound } = useGameEffects();

    const {
        isLoading,
        gameCompleted,
        showRaceMinigame,
        showBombMinigame,
        showSniperMinigame,
        showFingerRoulette,
        showTapBattle,
        showHighLowCard,
        showSequenceMinigame,
        activeChaosEvent,
        currentChallenge,
        showTrafficMinigame,
        players,
        gameDuration
    } = state;

    // 👇 4. EFECTO: Sonido al cambiar de carta ("Slashhh!")
    useEffect(() => {
        // Reproducir sonido solo si ya cargó el juego y hay un reto activo
        if (!isLoading && currentChallenge > 0) {
            playSound('whoosh'); // Asegúrate de tener whoosh.mp3 en public/sounds/
        }
    }, [currentChallenge, isLoading, playSound]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="text-center">
                    <Icon name="Loader" size={48} className="text-primary mx-auto mb-4 animate-spin" />
                    <p className="text-text-secondary">Preparando la partida...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden" style={{ backgroundImage: `url(${bgImage})` }}>
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>

            {/* Header */}
            <header className="relative z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3 shadow-lg">
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                    <div className="flex items-center space-x-3">

                        <img
                            src={kamikazeLogo}
                            alt="Kamikaze Logo"
                            className="w-12 h-12 object-contain rounded-lg shadow-md bg-black/20"
                        />
                        <div className="flex flex-col">
                            <h1 className="font-heading text-xl text-primary leading-none italic tracking-tighter shadow-black drop-shadow-sm">
                                Kamikaze!
                            </h1>
                            <p className="text-xs text-text-secondary font-medium uppercase tracking-widest">
                                Partida en progreso
                            </p>
                        </div>
                    </div>

                </div>
            </header>

            {/* Main Board */}
            <main className="relative z-10 pt-8 pb-32 px-4 max-w-2xl mx-auto space-y-6">
                <PlayerTurnIndicator
                    currentPlayer={currentPlayer}
                    players={players}
                    challenge={currentChallengeData}
                />

                <AnimatePresence mode="wait">
                    <ChallengeCard
                        key={currentChallenge}
                        challenge={currentChallengeData}
                        currentChallenge={currentChallenge}
                        totalChallenges={totalChallenges}
                    />
                </AnimatePresence>

                <GameControls
                    onNextChallenge={actions.nextChallenge}
                    onEndGame={actions.endGame}
                    isLastChallenge={isLastChallenge}
                    currentChallenge={currentChallenge}
                    totalChallenges={totalChallenges}
                />
            </main>

            {/* Modals */}
            <AnimatePresence>
                {gameCompleted && (
                    <GameCompletionModal
                        onClose={() => actions.setGameCompleted(false)}
                        players={players}
                        challengesCompleted={currentChallenge >= totalChallenges ? totalChallenges : currentChallenge - 1}
                        onRestartGame={actions.restartGame}
                        onNewGame={actions.newGame}
                        gameDuration={gameDuration}
                    />
                )}
            </AnimatePresence>

            <ChaosRouletteModal event={activeChaosEvent} onClose={actions.closeChaos} />

            {/* --- MINIJUEGOS --- */}

            {showRaceMinigame && (
                <AxolotlRaceMinigame players={players} onClose={actions.closeMinigame} />
            )}

            {showBombMinigame && (
                <TimeBombMinigame onClose={actions.closeBomb} currentPlayer={currentPlayer} />
            )}

            {/* ✅ FRANCOTIRADOR */}
            {showSniperMinigame && (
                <BlindSniperMinigame onClose={actions.closeSniper} currentPlayer={currentPlayer} />
            )}
            {/* Minijuego: Ruleta de Dedos*/}
            {showFingerRoulette && (
                <FingerRouletteMinigame
                    onClose={actions.closeRoulette}
                />
            )}

            {/* Minijuego: Batalla de Taps*/}
            {showTapBattle && (
                <TapBattleMinigame
                    onClose={actions.closeBattle}
                    players={players}
                />
            )}

            {/* Minijuego: Cartas del Destino */}
            {showHighLowCard && (
                <HighLowCardMinigame
                    onClose={actions.closeCards}
                    currentPlayer={currentPlayer}
                />
            )}

            {/* Minijuego: Semáforo Borracho */}
            {showTrafficLightMinigame && (
                <DrunkenTrafficLightMinigame onClose={actions.closeTrafficLight} />
            )}

            {/* Minijuego: Secuencia Tóxica */}
            {showSequenceMinigame && (
                <ToxicSequenceMinigame
                    onClose={actions.closeSequence}
                    currentPlayer={currentPlayer}
                />
            )}
        </div>
    );
};

export default ActiveGameSession;