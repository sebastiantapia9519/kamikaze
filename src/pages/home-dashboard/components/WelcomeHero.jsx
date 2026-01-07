import React from 'react';
import Icon from '../../../components/AppIcon';
import { motion } from 'framer-motion';

// --- CORRECCIÓN IMPORTANTE ---
// Como 'kamikaze-logo.png' no existe en tu carpeta, usamos el icono que SÍ tienes.
// Si luego guardas el logo de texto, solo cambia el nombre del archivo aquí abajo.
import logoImg from '../../../assets/images/kamikaze-logo.png';

const WelcomeHero = () => {
    return (
        <div className="flex flex-col items-center text-center w-full justify-start pt-0">

            {/* Logo gigante */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative w-72 sm:w-96 md:w-[40rem] z-0"
            >
                <img
                    src={logoImg}
                    alt="Kamikaze Logo"
                    className="w-full h-auto mx-auto drop-shadow-2xl"
                />

                {/* Brillos (Efectos visuales) */}
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-pink-500 rounded-full blur-xl animate-pulse opacity-50"></div>
                <div className="absolute -bottom-1 -left-1 w-8 h-8 bg-blue-500 rounded-full blur-xl animate-pulse opacity-40"></div>
            </motion.div>

            {/* Texto "pegado" al logo usando margen negativo */}
            <div className="-mt-20 sm:-mt-32 md:-mt-36 relative z-10 px-4">
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="font-body text-3xl sm:text-4xl md:text-5xl font-black text-white leading-snug drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]"
                >
                    La única misión de la noche es divertirse... y no derramar el pisto.
                </motion.p>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="font-caption text-lg sm:text-xl mt-2 text-blue-200 font-medium tracking-wide drop-shadow-md"
                >
                    La amistad a prueba de tragos.
                </motion.p>
            </div>

            {/* Iconos decorativos */}
            <div className="flex justify-center items-center space-x-4 opacity-80 mt-8 relative z-10">
                <Icon name="Cigarette" size={24} className="text-pink-400 animate-pulse" />
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-pink-500 to-transparent"></div>
                <div className="p-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
                    <Icon name="Beer" size={28} className="text-yellow-400" />
                </div>
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
                <Icon name="Music" size={24} className="text-blue-400 animate-pulse" />
            </div>
        </div>
    );
};

export default WelcomeHero;