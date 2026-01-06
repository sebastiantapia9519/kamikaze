import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const LegalWarningBanner = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [currentWarning, setCurrentWarning] = useState(0);

    const warnings = [
        {
            icon: 'AlertTriangle',
            text: 'Solo para mayores de 18 años',
            color: 'text-warning'
        },
        {
            icon: 'Shield',
            text: 'Bebe responsablemente',
            color: 'text-error'
        },
        {
            icon: 'Heart',
            text: 'Conoce tus límites',
            color: 'text-success'
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWarning((prev) => (prev + 1) % warnings?.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [warnings?.length]);

    if (!isVisible) return null;

    const warning = warnings?.[currentWarning];

    return (
        <div className="fixed top-0 left-0 right-0 z-300 bg-gradient-to-r from-error/90 to-warning/90 backdrop-blur-sm">
            <div className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center space-x-2 flex-1">
                    <Icon name={warning?.icon} size={18} className="text-white animate-pulse" />
                    <span className="text-white font-medium text-sm">
                        {warning?.text}
                    </span>
                </div>

                <button
                    onClick={() => setIsVisible(false)}
                    className="text-white/80 hover:text-white transition-colors duration-200"
                    aria-label="Cerrar banner"
                >
                    <Icon name="X" size={16} />
                </button>
            </div>
            {/* Progress indicator */}
            <div className="h-1 bg-white/20">
                <div
                    className="h-full bg-white transition-all duration-3000 ease-linear"
                    style={{
                        width: `${((currentWarning + 1) / warnings?.length) * 100}%`
                    }}
                />
            </div>
        </div>
    );
};

export default LegalWarningBanner;