import React from 'react';
import Icon from '../../../components/AppIcon';

const PlayerSetupHeader = ({ playerCount = 0 }) => {
    return (
        <div className="text-center space-y-4 mb-8">
            {/* Main Title */}
            <div className="relative">
                <h1 className="font-heading text-4xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary">
                    ¡Configura tu Grupo!
                </h1>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-warning to-secondary rounded-full flex items-center justify-center animate-bounce">
                    <Icon name="Sparkles" size={16} className="text-white" />
                </div>
            </div>

            {/* Subtitle */}
            <p className="font-body text-lg max-w-md mx-auto text-white">La banda está lista. ¡Empecemos!

            </p>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center space-x-4 p-4 bg-surface/50 rounded-lg border border-border max-w-sm mx-auto">
                <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${playerCount >= 1 ? 'bg-success' : 'bg-border'} transition-colors`} />
                    <div className={`w-3 h-3 rounded-full ${playerCount >= 2 ? 'bg-success' : 'bg-border'} transition-colors`} />
                    <div className={`w-3 h-3 rounded-full ${playerCount >= 4 ? 'bg-success' : 'bg-border'} transition-colors`} />
                    <div className={`w-3 h-3 rounded-full ${playerCount >= 6 ? 'bg-success' : 'bg-border'} transition-colors`} />
                </div>
                <div className="text-sm text-white">
                    {playerCount === 0 && 'Comienza agregando jugadores'}
                    {playerCount === 1 && 'Agrega 1 jugador más'}
                    {playerCount >= 2 && playerCount < 4 && '¡Perfecto! Puedes agregar más'}
                    {playerCount >= 4 && playerCount < 6 && '¡Excelente grupo!'}
                    {playerCount >= 6 && '¡Grupo épico!'}
                </div>
            </div>

            {/* Fun Stats */}
            <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto text-xs">
                <div className="flex items-center space-x-2 text-white">
                    <Icon name="Timer" size={14} className="text-primary" />
                    <span>2-12 jugadores ideales</span>
                </div>
                <div className="flex items-center space-x-2 text-white">
                    <Icon name="Zap" size={14} className="text-accent" />
                    <span>Diversión garantizada</span>
                </div>
            </div>
        </div>);

};

export default PlayerSetupHeader;