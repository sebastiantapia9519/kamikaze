import React from 'react';
import Icon from '../../../components/AppIcon';

const ResponsibleDrinkingReminder = () => {
    const safetyTips = [
        "Conoce tus límites y respétalos siempre",
        "Mantente hidratado bebiendo agua regularmente",
        "Come antes y durante el juego",
        "Nunca conduzcas después de beber",
        "Cuida de tus amigos y pide ayuda si es necesario"
    ];

    return (
        <div className="bg-warning/10 border-l-4 border-warning p-6 rounded-lg mb-8">
            <div className="flex items-center space-x-3 mb-4">
                <Icon name="AlertTriangle" size={24} className="text-warning" />
                <h3 className="font-body font-semibold text-lg text-warning">
                    Consumo Responsable
                </h3>
            </div>
            <p className="font-body text-text-primary mb-4">
                Kamikaze está diseñado para la diversión, pero tu seguridad y bienestar son lo más importante. Recuerda siempre:
            </p>
            <ul className="space-y-2">
                {safetyTips?.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                        <Icon name="Check" size={16} className="text-success mt-1 flex-shrink-0" />
                        <span className="font-body text-text-secondary text-sm">
                            {tip}
                        </span>
                    </li>
                ))}
            </ul>
            <div className="mt-4 p-3 bg-error/10 rounded-lg border border-error/20">
                <p className="font-body text-sm text-error font-medium">
                    <Icon name="Shield" size={16} className="inline mr-2" />
                    Solo para mayores de 18 años. Si sientes que el alcohol está afectando tu vida, busca ayuda profesional.
                </p>
            </div>
        </div>
    );
};

export default ResponsibleDrinkingReminder;