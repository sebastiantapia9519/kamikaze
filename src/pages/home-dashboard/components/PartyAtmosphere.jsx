import React from 'react';
import Icon from '../../../components/AppIcon';

const PartyAtmosphere = () => {
    const decorativeElements = [
        { icon: 'Beer', size: 16, position: 'top-4 left-4', color: 'text-secondary', delay: '0s' },
        { icon: 'Martini', size: 20, position: 'top-8 right-8', color: 'text-accent', delay: '0.5s' },
        { icon: 'Heart', size: 14, position: 'bottom-12 left-8', color: 'text-error', delay: '1s' },
        { icon: 'Sparkles', size: 18, position: 'bottom-8 right-4', color: 'text-primary', delay: '1.5s' },
        { icon: 'Banana', size: 16, position: 'top-1/3 left-2', color: 'text-secondary', delay: '2s' },
        { icon: 'Flame', size: 14, position: 'bottom-1/3 right-2', color: 'text-error', delay: '2.5s' }
    ];

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {/* Animated background elements */}
            {decorativeElements?.map((element, index) => (
                <div
                    key={index}
                    className={`absolute ${element?.position} opacity-20 animate-pulse-glow`}
                    style={{
                        animationDelay: element?.delay,
                        animationDuration: '3s'
                    }}
                >
                    <Icon
                        name={element?.icon}
                        size={element?.size}
                        className={element?.color}
                    />
                </div>
            ))}
            {/* Floating particles */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full opacity-30 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-accent rounded-full opacity-40 animate-bounce" style={{ animationDelay: '0.8s' }}></div>
            <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-secondary rounded-full opacity-50 animate-bounce" style={{ animationDelay: '1.2s' }}></div>
            <div className="absolute bottom-1/4 right-1/6 w-2.5 h-2.5 bg-error rounded-full opacity-25 animate-bounce" style={{ animationDelay: '1.6s' }}></div>
            {/* Gradient overlays for depth */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-radial from-primary/5 to-transparent rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-radial from-accent/5 to-transparent rounded-full"></div>
            <div className="absolute top-1/2 left-0 w-24 h-24 bg-gradient-radial from-secondary/5 to-transparent rounded-full"></div>
        </div>
    );
};

export default PartyAtmosphere;