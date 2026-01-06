import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const MainNavigationButtons = () => {
    const navigate = useNavigate();

    const navigationOptions = [
        {
            id: 'play',
            label: 'Jugar',
            description: 'Configurar jugadores y empezar',
            icon: 'Play',
            path: '/player-setup',
            variant: 'default',
            className: 'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-graffiti-lg hover:shadow-graffiti-lg transform hover:scale-105 transition-all duration-300'
        },
        {
            id: 'settings',
            label: 'Configuración',
            description: 'Personalizar reglas y categorías',
            icon: 'Settings',
            path: '/game-configuration',
            variant: 'outline',
            className: 'border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground shadow-graffiti-md hover:shadow-graffiti-lg transform hover:scale-105 transition-all duration-300'
        },
        {
            id: 'about',
            label: 'Acerca de',
            description: 'Reglas del juego e información',
            icon: 'Info',
            path: '/about-information',
            variant: 'ghost',
            className: 'text-gray-700 border border-gray-300 hover:bg-blue-500 hover:text-white  hover:border-blue-500 shadow-sm hover:shadow-lg transform hover:scale-105 transition-all duration-300'
        }
    ];

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="w-full max-w-md mx-auto space-y-6">
            {navigationOptions?.map((option, index) => (
                <div
                    key={option?.id}
                    className="group relative"
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    {/* Graffiti-style background decoration */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 rounded-lg transform rotate-1 group-hover:rotate-0 transition-transform duration-300"></div>

                    <Button
                        variant={option?.variant}
                        size="lg"
                        fullWidth
                        onClick={() => handleNavigation(option?.path)}
                        className={`relative h-auto py-6 px-8 flex-col items-center text-center ${option?.className}`}
                    >
                        {/* Icon with decorative background */}
                        <div className="relative mb-3">
                            <div className="absolute inset-0 bg-background/20 rounded-full blur-sm"></div>
                            <div className="relative p-3 rounded-full bg-background/10 backdrop-blur-sm">
                                <Icon name={option?.icon} size={32} />
                            </div>
                        </div>

                        {/* Button Content */}
                        <div className="space-y-1">
                            <h3 className="font-body font-bold text-xl">
                                {option?.label}
                            </h3>
                            <p className="text-sm opacity-80 font-caption">
                                {option?.description}
                            </p>
                        </div>

                        {/* Hover indicator */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Icon name="ChevronRight" size={20} />
                        </div>
                    </Button>
                </div>
            ))}
        </div>
    );
};

export default MainNavigationButtons;