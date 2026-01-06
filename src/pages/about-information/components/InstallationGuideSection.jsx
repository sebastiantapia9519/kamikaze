import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const InstallationGuideSection = () => {
    const [activeTab, setActiveTab] = useState('ios');

    const installationSteps = {
        ios: [
            { icon: 'Compass', title: 'Abre Safari', description: 'Navega a la página de Kamikaze en Safari (no Chrome)' }, // Cambié Icon 'Safari' por 'Compass' que es más común en librerías
            { icon: 'Share', title: 'Toca Compartir', description: 'Presiona el ícono de compartir en la barra inferior' },
            { icon: 'PlusSquare', title: 'Añadir a Inicio', description: 'Selecciona "Añadir a pantalla de inicio"' }, // Icono más preciso
            { icon: 'Check', title: '¡Listo!', description: 'Kamikaze aparecerá como una app nativa en tu iPhone' }
        ],
        android: [
            { icon: 'Chrome', title: 'Abre Chrome', description: 'Navega a Kamikaze usando Google Chrome' },
            { icon: 'MoreVertical', title: 'Menú Chrome', description: 'Toca los tres puntos en la esquina superior derecha' }, // Icono más preciso
            { icon: 'Download', title: 'Instalar App', description: 'Selecciona "Instalar aplicación" o "Añadir a pantalla de inicio"' },
            { icon: 'Smartphone', title: 'App Instalada', description: 'Kamikaze se instalará como una app completa en Android' }
        ]
    };

    return (
        // 👇 CAMBIO CLAVE: Usamos bg-gray-900 en lugar de bg-card para el negro profundo
        <div className="bg-gray-900 rounded-2xl p-6 border border-white/10 shadow-xl mb-8 overflow-hidden">

            {/* ENCABEZADO */}
            <div className="flex items-center space-x-3 mb-6">
                <Icon name="Download" size={24} className="text-blue-400" />
                <h3 className="text-xl font-bold text-white">
                    Instalación PWA
                </h3>
            </div>

            <p className="text-gray-400 text-sm mb-6">
                Instala Kamikaze como una aplicación nativa en tu dispositivo para una experiencia completa offline.
            </p>

            {/* TABS DE SELECCIÓN */}
            {/* Usamos botones HTML normales en lugar del componente Button para controlar el color exacto del fondo */}
            <div className="flex space-x-1 mb-6 bg-gray-800 p-1 rounded-xl border border-white/5">
                <button
                    onClick={() => setActiveTab('ios')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center space-x-2 transition-all ${activeTab === 'ios'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Icon name="Smartphone" size={16} />
                    <span>iOS</span>
                </button>
                <button
                    onClick={() => setActiveTab('android')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center space-x-2 transition-all ${activeTab === 'android'
                            ? 'bg-green-600 text-white shadow-md'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Icon name="Smartphone" size={16} /> {/* O icono de Android si lo tienes */}
                    <span>Android</span>
                </button>
            </div>

            {/* PASOS DE INSTALACIÓN */}
            <div className="space-y-4">
                {installationSteps[activeTab].map((step, index) => (
                    <div key={index} className="flex items-start space-x-4 p-3 rounded-xl bg-gray-800/30 border border-white/5">
                        {/* Círculo del número */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${activeTab === 'ios' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'
                            }`}>
                            <span className="font-bold text-sm">{index + 1}</span>
                        </div>

                        {/* Textos */}
                        <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                                <Icon name={step.icon} size={16} className={activeTab === 'ios' ? 'text-blue-400' : 'text-green-400'} />
                                <h4 className="font-bold text-white text-sm">
                                    {step.title}
                                </h4>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* SECCIÓN DE VENTAJAS (Adaptada al modo oscuro) */}
            <div className="mt-6 p-4 bg-gray-800/50 rounded-xl border border-white/10">
                <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Zap" size={18} className="text-yellow-400" />
                    <span className="font-bold text-sm text-white">
                        Ventajas de la instalación PWA
                    </span>
                </div>
                <ul className="grid grid-cols-2 gap-2">
                    {[
                        "Acceso offline completo",
                        "Carga más rápida",
                        "Experiencia nativa",
                        "Sin descargas pesadas"
                    ].map((ventaja, idx) => (
                        <li key={idx} className="text-xs text-gray-400 flex items-center">
                            <span className="w-1 h-1 bg-gray-500 rounded-full mr-2"></span>
                            {ventaja}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default InstallationGuideSection;