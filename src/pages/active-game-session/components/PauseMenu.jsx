import React from 'react';

const PauseMenu = ({ onResume, onQuit }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-auto">
            <div className="bg-gray-900 p-8 rounded-2xl flex flex-col items-center gap-4 border border-white/10 min-w-[300px]">
                <h2 className="text-3xl font-black text-white mb-6">PAUSA</h2>
                
                <button 
                    onClick={onResume}
                    className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-4 px-6 rounded-xl transition-transform active:scale-95"
                >
                    ▶ Continuar
                </button>
                
                <button 
                    onClick={onQuit}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-4 px-6 rounded-xl transition-transform active:scale-95 border border-white/5"
                >
                    ⏹ Salir
                </button>
            </div>
        </div>
    );
};

export default PauseMenu;
