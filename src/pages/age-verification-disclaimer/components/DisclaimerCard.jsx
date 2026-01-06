import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const DisclaimerCard = ({ onAccept, onReject }) => {
    const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e?.target;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;

        if (isAtBottom && !hasScrolledToBottom) {
            setHasScrolledToBottom(true);
        }

        setIsScrolling(true);
        setTimeout(() => setIsScrolling(false), 150);
    };

    const disclaimerContent = {
        title: "Kamikaze!",
        subtitle: "Juego de Beber Responsable",
        ageVerification: "Verificación de Edad",
        ageText: "Debes tener 18 años o más para usar esta aplicación. Al continuar, confirmas que tienes la edad legal para consumir alcohol en tu jurisdicción.",
        responsibleDrinking: "Consumo Responsable",
        responsibleText: `• Nunca conduzcas bajo la influencia del alcohol
• Conoce tus límites y bebe con moderación
• Asegúrate de tener un transporte seguro
• No participes si estás tomando medicamentos
• Detente si te sientes mareado o enfermo
• Mantente hidratado y come antes de beber`,
        liability: "Exención de Responsabilidad",
        liabilityText: `Al usar esta aplicación, aceptas que:
• Eres completamente responsable de tus acciones
• Los desarrolladores no son responsables de lesiones, daños o consecuencias
• Participas bajo tu propio riesgo
• Cumplirás con todas las leyes locales sobre alcohol
• Puedes dejar de jugar en cualquier momento`,
        warning: "⚠️ ADVERTENCIA: El consumo excesivo de alcohol puede ser peligroso para tu salud",
        acceptText: "He leído y acepto todos los términos",
        rejectText: "No acepto"
    };

    return (
        <div className="w-full max-w-md mx-auto bg-card/95 backdrop-blur-sm rounded-lg shadow-graffiti-lg border border-border overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-accent p-6 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="AlertTriangle" size={32} className="text-white" />
                </div>
                <h1 className="font-heading text-3xl text-white mb-2">
                    {disclaimerContent?.title}
                </h1>
                <p className="font-body text-white/90">
                    {disclaimerContent?.subtitle}
                </p>
            </div>
            {/* Scrollable Content */}
            <div
                className="max-h-96 overflow-y-auto p-6 space-y-6"
                onScroll={handleScroll}
            >
                {/* Age Verification */}
                <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <Icon name="Calendar" size={20} className="text-warning" />
                        <h2 className="font-body font-semibold text-lg text-text-primary">
                            {disclaimerContent?.ageVerification}
                        </h2>
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed">
                        {disclaimerContent?.ageText}
                    </p>
                </div>

                {/* Responsible Drinking */}
                <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <Icon name="Heart" size={20} className="text-success" />
                        <h2 className="font-body font-semibold text-lg text-text-primary">
                            {disclaimerContent?.responsibleDrinking}
                        </h2>
                    </div>
                    <div className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
                        {disclaimerContent?.responsibleText}
                    </div>
                </div>

                {/* Liability Waiver */}
                <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <Icon name="Shield" size={20} className="text-error" />
                        <h2 className="font-body font-semibold text-lg text-text-primary">
                            {disclaimerContent?.liability}
                        </h2>
                    </div>
                    <div className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
                        {disclaimerContent?.liabilityText}
                    </div>
                </div>

                {/* Warning */}
                <div className="bg-warning/10 border border-warning/20 p-4 rounded-lg">
                    <p className="text-warning text-sm font-medium text-center">
                        {disclaimerContent?.warning}
                    </p>
                </div>

                {/* Scroll Indicator */}
                {!hasScrolledToBottom && (
                    <div className="text-center py-2">
                        <div className="flex items-center justify-center space-x-2 text-text-secondary">
                            <Icon name="ChevronDown" size={16} className={isScrolling ? 'animate-bounce' : ''} />
                            <span className="text-xs">Desplázate para continuar</span>
                            <Icon name="ChevronDown" size={16} className={isScrolling ? 'animate-bounce' : ''} />
                        </div>
                    </div>
                )}
            </div>
            {/* Action Buttons */}
            <div className="p-6 bg-surface/50 border-t border-border space-y-3">
                <Button
                    variant="default"
                    fullWidth
                    onClick={onAccept}
                    disabled={!hasScrolledToBottom}
                    className={`bg-gradient-to-r from-success to-primary hover:from-success/90 hover:to-primary/90 ${!hasScrolledToBottom ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    <Icon name="Check" size={18} />
                    <span className="ml-2">{disclaimerContent?.acceptText}</span>
                </Button>

                <Button
                    variant="outline"
                    fullWidth
                    onClick={onReject}
                    className="border-error text-error hover:bg-error hover:text-error-foreground"
                >
                    <Icon name="X" size={18} />
                    <span className="ml-2">{disclaimerContent?.rejectText}</span>
                </Button>
            </div>
        </div>
    );
};

export default DisclaimerCard;