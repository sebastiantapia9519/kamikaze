import React from 'react';
import Icon from '../../../components/AppIcon';

const GameDescriptionSection = () => {
    return (
        <div className="bg-card p-6 rounded-lg shadow-graffiti-md mb-8">
            <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-graffiti-sm">
                    {/* Aquí ajustamos el tamaño de la imagen */}
                    <img
                        src="https://i.imgur.com/Pt92CPj.png"
                        alt="Kamikaze logo"
                        className="w-full h-full object-contain animate-pulse"
                    />
                </div>
                <h2 className="font-heading text-2xl text-primary">
                    ¿Qué es Kamikaze?
                </h2>
            </div>

            <div className="space-y-4 text-text-primary">
                <p className="font-body text-lg leading-relaxed">
                    Kamikaze! nació después de muchas pedas, de probar un chorro de juegos para beber que nunca terminaban de cumplir con lo que queríamos: diversión sin límites.
                </p>

                <div className="bg-surface/50 p-4 rounded-lg border-l-4 border-accent">
                    <p className="font-body">
                        Con más de 115 retos únicos distribuidos en tres categorías intensas: <span className="text-secondary font-semibold">Regulares</span>, <span className="text-accent font-semibold">Épicos</span> y <span className="text-primary font-semibold">Multijugador</span>, cada partida es una aventura completamente nueva.
                    </p>
                </div>

                <p className="font-body">
                    Este juego tiene como propósito ser la mejor experiencia de peda, porque toma en cuenta la voz y las ocurrencias de todos los borrachos y borrachas que buscan pasar horas riéndose, retándose y levantando la copa una y otra vez. Aquí no hay reglas aburridas ni excusas: solo ganas de jugar, beber y crear recuerdos épicos (o lagunas mentales, depende cuántos shots aguantes).
                </p>
            </div>
        </div>
    );
};

export default GameDescriptionSection;