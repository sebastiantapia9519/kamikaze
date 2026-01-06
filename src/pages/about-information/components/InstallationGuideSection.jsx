import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InstallationGuideSection = () => {
    const [activeTab, setActiveTab] = useState('ios');

    const installationSteps = {
        ios: [
            {
                icon: 'Safari',
                title: 'Abre Safari',
                description: 'Navega a la página de Kamikaze en Safari (no Chrome)'
            },
            {
                icon: 'Share',
                title: 'Toca Compartir',
                description: 'Presiona el ícono de compartir en la barra inferior'
            },
            {
                icon: 'Plus',
                title: 'Añadir a Inicio',
                description: 'Selecciona "Añadir a pantalla de inicio"'
            },
            {
                icon: 'Check',
                title: '¡Listo!',
                description: 'Kamikaze aparecerá como una app nativa en tu iPhone'
            }
        ],
        android: [
            {
                icon: 'Chrome',
                title: 'Abre Chrome',
                description: 'Navega a Kamikaze usando Google Chrome'
            },
            {
                icon: 'Menu',
                title: 'Menú Chrome',
                description: 'Toca los tres puntos en la esquina superior derecha'
            },
            {
                icon: 'Download',
                title: 'Instalar App',
                description: 'Selecciona "Instalar aplicación" o "Añadir a pantalla de inicio"'
            },
            {
                icon: 'Smartphone',
                title: 'App Instalada',
                description: 'Kamikaze se instalará como una app completa en Android'
            }
        ]
    };

    return (
        <div className="bg-card p-6 rounded-lg shadow-graffiti-md mb-8">
            <div className="flex items-center space-x-3 mb-6">
                <Icon name="Download" size={24} className="text-primary" />
                <h3 className="font-heading text-xl text-text-primary">
                    Instalación PWA
                </h3>
            </div>
            <p className="font-body text-text-secondary mb-6">
                Instala Kamikaze como una aplicación nativa en tu dispositivo para una experiencia completa offline.
            </p>
            {/* Platform Tabs */}
            <div className="flex space-x-1 mb-6 bg-surface/50 p-1 rounded-lg">
                <Button
                    variant={activeTab === 'ios' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('ios')}
                    className="flex-1"
                >
                    <Icon name="Smartphone" size={16} />
                    <span className="ml-2">iOS</span>
                </Button>
                <Button
                    variant={activeTab === 'android' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('android')}
                    className="flex-1"
                >
                    <Icon name="Android" size={16} />
                    <span className="ml-2">Android</span>
                </Button>
            </div>
            {/* Installation Steps */}
            <div className="space-y-4">
                {installationSteps?.[activeTab]?.map((step, index) => (
                    <div key={index} className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                                <Icon name={step?.icon} size={18} className="text-accent" />
                                <h4 className="font-body font-semibold text-text-primary">
                                    {step?.title}
                                </h4>
                            </div>
                            <p className="text-sm text-text-secondary">
                                {step?.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 p-4 bg-success/10 rounded-lg border border-success/20">
                <div className="flex items-center space-x-2">
                    <Icon name="Zap" size={18} className="text-success" />
                    <span className="font-body font-medium text-success">
                        Ventajas de la instalación PWA
                    </span>
                </div>
                <ul className="mt-2 space-y-1 text-sm text-text-secondary">
                    <li>• Acceso offline completo</li>
                    <li>• Carga más rápida</li>
                    <li>• Experiencia de app nativa</li>
                    <li>• No ocupa espacio adicional</li>
                </ul>
            </div>
        </div>
    );
};

export default InstallationGuideSection;