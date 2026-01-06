import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeHero = () => {
    return (
        <div className="flex flex-col items-center text-center w-full justify-start pt-8">
            {/* Logo gigante, pegado al top */}
            <div className="relative w-72 sm:w-96 md:w-[40rem]">
                <img
                    src="https://i.imgur.com/K3DmbLD.png"
                    alt="Kamikaze Logo"
                    className="w-full h-auto mx-auto" />

                {/* Brillos */}
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-accent rounded-full animate-pulse-glow opacity-100"></div>
                <div className="absolute -bottom-1 -left-1 w-8 h-8 bg-secondary rounded-full animate-pulse-glow opacity-60"></div>
            </div>

            {/* Textos muy pegados al logo */}
            <div className="mt-4">
                <p className="font-body text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary leading-snug">
                    La única misión de la noche es divertirse... y no derramar el pisto.
                </p>
                <p className="font-caption text-lg sm:text-xl mt-1 text-[rgba(227,225,254,1)]">La amistad a prueba de tragos.

                </p>
            </div>

            {/* Iconos compactos justo debajo del subtítulo */}
            <div className="flex justify-center items-center space-x-3 opacity-70 mt-4">
                <Icon name="Cigarette" size={24} className="text-accent animate-pulse" />
                <div className="w-12 h-0.5 bg-gradient-to-r from-primary to-accent"></div>
                <Icon name="Beer" size={28} className="text-secondary" />
                <div className="w-12 h-0.5 bg-gradient-to-r from-accent to-secondary"></div>
                <Icon name="Music" size={24} className="text-error animate-pulse" />
            </div>
        </div>);

};

export default WelcomeHero;