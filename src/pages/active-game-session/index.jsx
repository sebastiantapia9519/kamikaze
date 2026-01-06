/**
 * @file ActiveGameSession.js
 * @description Vista principal. Lógica movida a hooks/useActiveGame.js
 */

import React from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// --- LOGIC HOOK ---
import { useActiveGame } from '../../hooks/useActiveGame';

// --- COMPONENTS ---
import ChallengeCard from './components/ChallengeCard';
import GameControls from './components/GameControls';
import GameCompletionModal from './components/GameCompletionModal';
import PlayerTurnIndicator from './components/PlayerTurnIndicator';
import ChaosRouletteModal from './components/ChaosRouletteModal';
import Icon from '../../components/AppIcon';

// --- MINIGAMES ---
import AxolotlRaceMinigame from './components/AxolotlRaceMinigame';
import TimeBombMinigame from './components/TimeBombMinigame';
import BlindSniperMinigame from './components/BlindSniperMinigame'; // 
import FingerRouletteMinigame from './components/FingerRouletteMinigame';
import TapBattleMinigame from './components/TapBattleMinigame';

// --- ASSETS ---
import bgImage from '../../assets/images/graffiti-bg.png';

const ActiveGameSession = () => {
    const location = useLocation();

    // Invocamos el Hook
    const {
        state,
        totalChallenges,
        currentPlayer,
        currentChallengeData,
        isLastChallenge,
        actions
    } = useActiveGame(location.state);

    const {
        isLoading,
        gameCompleted,
        showRaceMinigame,
        showBombMinigame,
        showSniperMinigame,
        showFingerRoulette,
        showTapBattle,
        activeChaosEvent,
        currentChallenge,
        players,
        gameDuration
    } = state;

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
            <header className="relative z-10 bg-background/95 backdrop-blur-sm border-b border-border">
                <div className="px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {/* Usamos el logo de public directo */}
                        <img
                            src="/iconKamikaze512x512.png"
                            alt="Kamikaze Logo"
                            className="w-16 h-16 object-contain"
                        />
                        <div>
                            <h1 className="font-heading text-xl text-text-primary">Kamikaze!</h1>
                            <p className="text-sm text-text-secondary">Juego en progreso • {totalChallenges} retos</p>
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
            {/* 👆 Minijuego: Ruleta de Dedos (NUEVO) */}
            {state.showFingerRoulette && (
                <FingerRouletteMinigame
                    onClose={actions.closeRoulette}
                />
            )}

            {/* 🥊 Minijuego: Batalla de Taps (NUEVO) */}
            {state.showTapBattle && (
                <TapBattleMinigame
                    onClose={actions.closeBattle}
                    players={state.players} // Necesita saber los jugadores para poner nombres
                />
            )}
        </div>
    );
};

export default ActiveGameSession;