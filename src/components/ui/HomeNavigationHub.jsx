import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import Icon from '../AppIcon';

const HomeNavigationHub = () => {
    const navigate = useNavigate();

    const navigationOptions = [
        {
            id: 'play',
            label: 'Start Game',
            description: 'Set up players and begin',
            icon: 'Play',
            path: '/player-setup',
            variant: 'default',
            className: 'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90'
        },
        {
            id: 'settings',
            label: 'Game Settings',
            description: 'Configure rules and categories',
            icon: 'Settings',
            path: '/game-configuration',
            variant: 'outline',
            className: 'border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground'
        },
        {
            id: 'about',
            label: 'About & Rules',
            description: 'Learn how to play',
            icon: 'Info',
            path: '/about-information',
            variant: 'ghost',
            className: 'text-text-primary hover:bg-surface hover:text-text-primary'
        }
    ];

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="w-full max-w-md mx-auto space-y-4">
            <div className="text-center mb-8">
                <h2 className="font-heading text-2xl text-text-primary mb-2">
                    Ready to Play?
                </h2>
                <p className="font-body text-text-secondary">
                    Choose an option to get started
                </p>
            </div>
            <div className="space-y-4">
                {navigationOptions?.map((option) => (
                    <div
                        key={option?.id}
                        className="group relative"
                    >
                        <Button
                            variant={option?.variant}
                            size="lg"
                            fullWidth
                            onClick={() => handleNavigation(option?.path)}
                            className={`h-auto py-6 px-6 flex-col items-start text-left shadow-graffiti-md hover:shadow-graffiti-lg transition-all duration-300 ${option?.className}`}
                        >
                            <div className="flex items-center justify-between w-full mb-2">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 rounded-lg bg-background/20">
                                        <Icon name={option?.icon} size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-body font-semibold text-lg">
                                            {option?.label}
                                        </h3>
                                    </div>
                                </div>
                                <Icon
                                    name="ChevronRight"
                                    size={20}
                                    className="opacity-60 group-hover:opacity-100 transition-opacity duration-200"
                                />
                            </div>
                            <p className="text-sm opacity-80 ml-14">
                                {option?.description}
                            </p>
                        </Button>
                    </div>
                ))}
            </div>
            {/* Quick Stats or Info */}
            <div className="mt-8 p-4 bg-surface/50 rounded-lg border border-border">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                        <Icon name="Users" size={16} className="text-text-secondary" />
                        <span className="text-text-secondary">2-8 Players</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Icon name="Clock" size={16} className="text-text-secondary" />
                        <span className="text-text-secondary">15-30 min</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Icon name="Zap" size={16} className="text-text-secondary" />
                        <span className="text-text-secondary">High Energy</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeNavigationHub;