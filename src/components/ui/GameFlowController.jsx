import React, { useState, useEffect } from 'react';
import Button from './Button';
import Icon from '../AppIcon';

const GameFlowController = ({
    currentChallenge = 1,
    totalChallenges = 20,
    onNextChallenge,
    onPreviousChallenge,
    onEndGame,
    onPauseGame,
    gameState = 'playing', // 'playing', 'paused', 'completed'
    players = [],
    currentPlayer = null
}) => {
    const [isPaused, setIsPaused] = useState(gameState === 'paused');
    const [showEndConfirm, setShowEndConfirm] = useState(false);

    const progress = (currentChallenge / totalChallenges) * 100;

    const handlePause = () => {
        setIsPaused(!isPaused);
        if (onPauseGame) {
            onPauseGame(!isPaused);
        }
    };

    const handleEndGame = () => {
        if (showEndConfirm) {
            if (onEndGame) {
                onEndGame();
            }
            setShowEndConfirm(false);
        } else {
            setShowEndConfirm(true);
        }
    };

    const handleNext = () => {
        if (onNextChallenge) {
            onNextChallenge();
        }
    };

    const handlePrevious = () => {
        if (onPreviousChallenge && currentChallenge > 1) {
            onPreviousChallenge();
        }
    };

    // Auto-hide end confirmation after 5 seconds
    useEffect(() => {
        if (showEndConfirm) {
            const timer = setTimeout(() => {
                setShowEndConfirm(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [showEndConfirm]);

    return (
        <div className="fixed inset-x-0 top-16 z-150 bg-background/95 backdrop-blur-sm border-b border-border">
            {/* Progress Bar */}
            <div className="w-full h-1 bg-surface">
                <div
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
            {/* Game Controls */}
            <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Left: Game Info */}
                    <div className="flex items-center space-x-4">
                        <div className="text-sm">
                            <span className="font-data text-text-primary">
                                {currentChallenge}/{totalChallenges}
                            </span>
                            <span className="text-text-secondary ml-2">Challenges</span>
                        </div>

                        {currentPlayer && (
                            <div className="flex items-center space-x-2 px-3 py-1 bg-surface rounded-full">
                                <Icon name="User" size={14} className="text-accent" />
                                <span className="text-sm font-medium text-text-primary">
                                    {currentPlayer?.name}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Right: Action Buttons */}
                    <div className="flex items-center space-x-2">
                        {/* Previous Challenge */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handlePrevious}
                            disabled={currentChallenge <= 1}
                            className="text-text-secondary hover:text-text-primary"
                        >
                            <Icon name="ChevronLeft" size={18} />
                        </Button>

                        {/* Pause/Resume */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePause}
                            className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                        >
                            <Icon name={isPaused ? 'Play' : 'Pause'} size={16} />
                            <span className="ml-1 hidden sm:inline">
                                {isPaused ? 'Resume' : 'Pause'}
                            </span>
                        </Button>

                        {/* End Game */}
                        <Button
                            variant={showEndConfirm ? "destructive" : "ghost"}
                            size="sm"
                            onClick={handleEndGame}
                            className={showEndConfirm ? "" : "text-text-secondary hover:text-error"}
                        >
                            <Icon name={showEndConfirm ? 'AlertTriangle' : 'X'} size={16} />
                            <span className="ml-1 hidden sm:inline">
                                {showEndConfirm ? 'Confirm End' : 'End'}
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-150 bg-background/95 backdrop-blur-sm border-t border-border p-4">
                <div className="flex items-center justify-between max-w-md mx-auto">
                    {/* Challenge Navigation */}
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentChallenge <= 1}
                        className="flex-1 mr-2"
                    >
                        <Icon name="ChevronLeft" size={18} />
                        <span className="ml-1">Previous</span>
                    </Button>

                    {/* Next Challenge */}
                    <Button
                        variant="default"
                        onClick={handleNext}
                        disabled={currentChallenge >= totalChallenges}
                        className="flex-1 ml-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                    >
                        <span className="mr-1">
                            {currentChallenge >= totalChallenges ? 'Finish' : 'Next'}
                        </span>
                        <Icon name={currentChallenge >= totalChallenges ? 'Flag' : 'ChevronRight'} size={18} />
                    </Button>
                </div>
            </div>
            {/* Pause Overlay */}
            {isPaused && (
                <div className="fixed inset-0 z-200 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-card p-8 rounded-lg shadow-graffiti-lg text-center max-w-sm mx-4">
                        <Icon name="Pause" size={48} className="text-secondary mx-auto mb-4" />
                        <h3 className="font-heading text-xl text-text-primary mb-2">
                            Game Paused
                        </h3>
                        <p className="text-text-secondary mb-6">
                            Take a break! Resume when ready.
                        </p>
                        <Button
                            variant="default"
                            onClick={handlePause}
                            className="bg-gradient-to-r from-primary to-accent"
                        >
                            <Icon name="Play" size={18} />
                            <span className="ml-2">Resume Game</span>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameFlowController;