import React from 'react';
// 👇 CORRECCIÓN: Solo 3 niveles hacia atrás (../../../) para llegar a src
import kamikazeIcon from '../../../assets/images/iconKamikaze192x192.png';

const GameDescriptionSection = () => {
    return (
        // ESTILO OSCURO UNIFICADO (bg-gray-900)
        <div className="bg-gray-900 rounded-2xl p-6 md:p-8 border border-white/10 shadow-xl mb-8 relative overflow-hidden">

            {/* Decoración superior */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-70" />

            {/* ENCABEZADO */}
            <div className="flex items-center space-x-4 mb-6 relative z-10">
                {/* Caja del logo oscurecida */}
                <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center shadow-lg border border-white/5 p-2">
                    {/* Usamos la variable importada aquí */}
                    <img
                        src={kamikazeIcon}
                        alt="Kamikaze logo"
                        className="w-full h-full object-contain drop-shadow-md hover:scale-110 transition-transform duration-300"
                    />
                </div>
                <h2 className="text-2xl font-black text-white italic tracking-wide">
                    ¿Qué es Kamikaze?
                </h2>
            </div>

            {/* CONTENIDO DE TEXTO */}
            <div className="space-y-6 relative z-10">
                <p className="text-gray-300 text-lg leading-relaxed font-medium">
                    Kamikaze! nació después de muchas pedas, de probar un chorro de juegos para beber que nunca terminaban de cumplir con lo que queríamos: <span className="text-white font-bold">diversión sin límites.</span>
                </p>

                {/* CAJA DESTACADA (Highlight Box) */}
                <div className="bg-gray-800/50 p-5 rounded-xl border-l-4 border-purple-500 shadow-inner">
                    <p className="text-gray-300 leading-relaxed">
                        Con más de <span className="text-white font-bold">115 retos únicos</span> distribuidos en tres categorías intensas: <span className="text-cyan-400 font-bold">Regulares</span>, <span className="text-yellow-400 font-bold">Épicos</span> y <span className="text-pink-400 font-bold">Multijugador</span>, cada partida es una aventura completamente nueva.
                    </p>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed">
                    Este juego tiene como propósito ser la mejor experiencia de peda, porque toma en cuenta la voz y las ocurrencias de todos los borrachos y borrachas que buscan pasar horas riéndose, retándose y levantando la copa una y otra vez.
                    <br /><br />
                    <span className="text-gray-300 italic border-l-2 border-white/20 pl-3 block">
                        Aquí no hay reglas aburridas ni excusas: solo ganas de jugar, beber y crear recuerdos épicos (o lagunas mentales, depende cuántos shots aguantes).
                    </span>
                </p>
            </div>
        </div>
    );
};

export default GameDescriptionSection;