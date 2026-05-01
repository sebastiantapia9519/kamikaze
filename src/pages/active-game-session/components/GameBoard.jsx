import React from 'react';
import Icon from '../../../components/AppIcon';

const GameBoard = ({ players }) => {
    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Neon Grid Background Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,20,147,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,128,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [transform:perspective(500px)_rotateX(60deg)] origin-bottom opacity-50"></div>
            
            {/* Central Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Construction Message */}
            <div className="relative z-10 bg-black/50 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-[0_0_30px_rgba(255,20,147,0.3)] flex flex-col items-center max-w-lg text-center transform -rotate-2">
                <Icon name="Wrench" size={48} className="text-warning mb-4 drop-shadow-[0_0_10px_rgba(255,165,0,0.8)] animate-pulse" />
                <h1 className="text-white text-4xl sm:text-5xl font-heading tracking-wider uppercase drop-shadow-[0_0_15px_rgba(0,128,255,0.8)]">
                    Tablero Principal
                </h1>
                <div className="mt-4 inline-block bg-warning/20 border border-warning/50 text-warning px-4 py-1 rounded-full font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(255,165,0,0.4)]">
                    En Construcción
                </div>
                <p className="mt-6 text-white/70 font-body">
                    Pronto habrá casillas, trampas y mucho caos.
                </p>
            </div>
        </div>
    );
};

export default GameBoard;
