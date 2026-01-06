import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ThemeSwitcher = ({ currentTheme, onThemeChange }) => {
    const themes = [
        {
            id: 'dark',
            label: 'Modo Oscuro',
            description: 'Perfecto para ambientes nocturnos',
            icon: 'Moon',
            preview: 'bg-background border-border',
            active: currentTheme === 'dark'
        },
        {
            id: 'light',
            label: 'Modo Claro',
            description: 'Ideal para espacios bien iluminados',
            icon: 'Sun',
            preview: 'bg-white border-gray-300',
            active: currentTheme === 'light'
        }];


    return (
        <div className="bg-card/80 backdrop-blur-sm p-6 rounded-lg shadow-graffiti-md border border-border/50 hidden">
            <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-accent/20 rounded-lg">
                    <Icon name="Palette" size={24} className="text-accent" />
                </div>
                <div>
                    <h2 className="font-heading text-xl text-text-primary">
                        Tema Visual
                    </h2>
                    <p className="text-text-secondary text-sm">
                        Elige tu estilo preferido
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {themes?.map((theme) =>
                    <div
                        key={theme?.id}
                        className={`relative p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer group ${theme?.active ?
                                'border-primary bg-primary/10 shadow-graffiti-sm' :
                                'border-border/30 hover:border-border/60 hover:shadow-graffiti-sm'}`
                        }
                        onClick={() => onThemeChange(theme?.id)}>

                        {/* Theme Preview */}
                        <div className={`w-full h-16 rounded-lg mb-4 ${theme?.preview} border-2 relative overflow-hidden`}>
                            <div className="absolute inset-2 flex items-center justify-center">
                                <Icon
                                    name={theme?.icon}
                                    size={24}
                                    className={theme?.id === 'dark' ? 'text-white' : 'text-gray-800'} />

                            </div>

                            {/* Graffiti-style decoration */}
                            <div className="absolute top-1 right-1">
                                <div className={`w-2 h-2 rounded-full ${theme?.id === 'dark' ? 'bg-primary' : 'bg-accent'}`
                                }></div>
                            </div>
                        </div>

                        {/* Theme Info */}
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h3 className="font-body font-semibold text-text-primary mb-1 flex items-center space-x-2">
                                    <Icon name={theme?.icon} size={18} className="text-text-secondary" />
                                    <span>{theme?.label}</span>
                                </h3>
                                <p className="text-text-secondary text-sm">
                                    {theme?.description}
                                </p>
                            </div>

                            {/* Active indicator */}
                            {theme?.active &&
                                <div className="ml-2">
                                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                        <Icon name="Check" size={14} className="text-white" />
                                    </div>
                                </div>
                            }
                        </div>

                        {/* Hover effect */}
                        <div className={`absolute inset-0 rounded-lg transition-opacity duration-200 ${theme?.active ?
                                'bg-primary/5' : 'bg-transparent group-hover:bg-surface/20'}`
                        }></div>
                    </div>
                )}
            </div>
            {/* Quick Switch Button */}
            <div className="mt-6 flex justify-center">
                <Button
                    variant="outline"
                    onClick={() => onThemeChange(currentTheme === 'dark' ? 'light' : 'dark')}
                    className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground">

                    <Icon name="RefreshCw" size={18} />
                    <span className="ml-2">Cambiar Tema</span>
                </Button>
            </div>
        </div>);

};

export default ThemeSwitcher;