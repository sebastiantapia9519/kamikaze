import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ConfigurationActions = ({
    hasChanges,
    onSave,
    onReset,
    onBackToHome,
    isSaving = false
}) => {
    return (
        <div className="space-y-6">
            {/* Save/Reset Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Button
                    variant="default"
                    onClick={onSave}
                    disabled={!hasChanges || isSaving}
                    loading={isSaving}
                    className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-graffiti-md">

                    <Icon name="Save" size={18} />
                    <span className="ml-2">
                        {isSaving ? 'Guardando...' : 'Guardar Configuración'}
                    </span>
                </Button>

                <Button
                    variant="outline"
                    onClick={onReset}
                    className="flex-1 border-error text-error hover:bg-error hover:text-error-foreground">

                    <Icon name="RotateCcw" size={18} />
                    <span className="ml-2">Restablecer</span>
                </Button>
            </div>

            {/* Navigation Actions */}
            <div className="flex-col sm:flex-row gap-4 hidden">
                <Button
                    variant="ghost"
                    onClick={onBackToHome}
                    className="flex-1 text-text-secondary hover:text-text-primary hover:bg-surface/50">

                    <Icon name="Home" size={18} />
                    <span className="ml-2">Volver al Inicio</span>
                </Button>

                <Button
                    variant="secondary"
                    onClick={() => window.location.href = '/player-setup'}
                    className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90">

                    <Icon name="Users" size={18} />
                    <span className="ml-2">Configurar Jugadores</span>
                </Button>
            </div>

            {/* Changes Indicator */}
            {hasChanges &&
                <div className="bg-warning/10 border border-warning/20 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <Icon name="AlertCircle" size={18} className="text-warning" />
                        <span className="text-warning font-medium">
                            Tienes cambios sin guardar
                        </span>
                    </div>
                    <p className="text-sm text-text-secondary mt-1">
                        No olvides guardar tu configuración antes de iniciar un juego.
                    </p>
                </div>
            }

            {/* Success Message */}
            {!hasChanges && !isSaving &&
                <div className="bg-success/10 border border-success/20 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <Icon name="CheckCircle" size={18} className="text-success" />
                        <span className="text-success font-medium">
                            Configuración guardada correctamente
                        </span>
                    </div>
                    <p className="text-sm text-text-secondary mt-1">
                        Tus preferencias están listas para el próximo juego.
                    </p>
                </div>
            }
        </div>);

};

export default ConfigurationActions;