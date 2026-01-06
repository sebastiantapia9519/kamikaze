import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ResponsibilityReminder = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto">
            <div className="bg-warning/90 backdrop-blur-sm border border-warning/30 rounded-lg p-4 shadow-graffiti-md">
                <div className="flex items-start space-x-3">
                    {/* Botón de la X, ahora al inicio del flex */}
                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-warning-foreground/60 hover:text-warning-foreground transition-colors p-1"
                        aria-label="Cerrar recordatorio"
                    >
                        <Icon name="X" size={16} />
                    </button>

                    <Icon name="AlertTriangle" size={20} className="text-warning-foreground mt-0.5 flex-shrink-0" />

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-warning-foreground mb-1">
                            Bebe Responsablemente
                        </p>
                        <p className="text-xs text-warning-foreground/80">
                            Conoce tus límites y cuida de tus amigos
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResponsibilityReminder;