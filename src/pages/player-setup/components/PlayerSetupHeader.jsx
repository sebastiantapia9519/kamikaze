import React from 'react';
import Icon from '../../../components/AppIcon';

const PlayerSetupHeader = ({ playerCount = 0 }) => {
    return (
        <div className="text-center space-y-4 mb-8">
            {/* Main Title */}
            <div className="relative inline-block">
                <h1 className="font-heading text-4xl sm:text-5xl text-white drop-shadow-md px-4 tracking-wide">
                    ¡Configura tu Grupo!
                </h1>
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-gradient-to-br from-warning to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <Icon name="Sparkles" size={20} className="text-white" />
                </div>
            </div>

            {/* Subtitle */}
            <p className="font-body text-lg max-w-md mx-auto text-white/80 font-medium">
                La banda está lista. ¡Empecemos!
            </p>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center space-x-4 p-4 bg-zinc-900/60 backdrop-blur-md rounded-xl border border-white/10 shadow-lg max-w-sm mx-auto">
                <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${playerCount >= 1 ? 'bg-emerald-400' : 'bg-white/20'} transition-all duration-300`} />
                    <div className={`w-3 h-3 rounded-full ${playerCount >= 2 ? 'bg-emerald-400' : 'bg-white/20'} transition-all duration-300`} />
                    <div className={`w-3 h-3 rounded-full ${playerCount >= 4 ? 'bg-emerald-400' : 'bg-white/20'} transition-all duration-300`} />
                    <div className={`w-3 h-3 rounded-full ${playerCount >= 6 ? 'bg-emerald-400' : 'bg-white/20'} transition-all duration-300`} />
                </div>
                <div className="text-sm font-medium text-white/90">
                    {playerCount === 0 && 'Comienza agregando jugadores'}
                    {playerCount === 1 && 'Agrega 1 jugador más'}
                    {playerCount >= 2 && playerCount < 4 && '¡Perfecto! Puedes agregar más'}
                    {playerCount >= 4 && playerCount < 6 && '¡Excelente grupo!'}
                    {playerCount >= 6 && '¡Grupo épico!'}
                </div>
            </div>

            {/* Fun Stats */}
            <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto text-xs font-medium">
                <div className="flex items-center space-x-2 text-white bg-zinc-900/60 px-3 py-2 rounded-lg border border-white/10 backdrop-blur-sm">
                    <Icon name="Timer" size={14} className="text-sky-400" />
                    <span>2-12 jugadores ideales</span>
                </div>
                <div className="flex items-center space-x-2 text-white bg-zinc-900/60 px-3 py-2 rounded-lg border border-white/10 backdrop-blur-sm">
                    <Icon name="Zap" size={14} className="text-yellow-400" />
                    <span>Diversión garantizada</span>
                </div>
            </div>
        </div>
    );

};

export default PlayerSetupHeader;