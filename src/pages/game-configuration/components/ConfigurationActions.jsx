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
            {/* ACCIONES PRINCIPALES (Guardar / Reset) */}
            <div className="flex flex-col sm:flex-row gap-4">

                {/* Botón GUARDAR */}
                <Button
                    variant="default"
                    onClick={onSave}
                    disabled={!hasChanges || isSaving}
                    loading={isSaving}
                    // Gradiente vibrante y sombra fuerte
                    className={`flex-1 font-bold text-white shadow-lg transition-all transform active:scale-95
                        ${!hasChanges
                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5'
                            : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-blue-500/20 hover:shadow-blue-500/40'
                        }`}
                >
                    <Icon name="Save" size={20} />
                    <span className="ml-2 uppercase tracking-wide">
                        {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                    </span>
                </Button>

                {/* Botón RESTABLECER */}
                <Button
                    variant="outline"
                    onClick={onReset}
                    // Borde rojo sutil y texto rojo que brilla al pasar el mouse
                    className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500 hover:text-red-300 transition-all font-bold"
                >
                    <Icon name="RotateCcw" size={18} />
                    <span className="ml-2">Restablecer</span>
                </Button>
            </div>

            {/* Navigation Actions (Ocultos según tu código original, pero estilizados por si acaso) */}
            <div className="hidden flex-col sm:flex-row gap-4">
                <Button
                    variant="ghost"
                    onClick={onBackToHome}
                    className="flex-1 text-gray-400 hover:text-white hover:bg-white/5"
                >
                    <Icon name="Home" size={18} />
                    <span className="ml-2">Volver al Inicio</span>
                </Button>
            </div>

            {/* MENSAJE: CAMBIOS SIN GUARDAR */}
            {hasChanges && (
                <div className="bg-yellow-900/20 border border-yellow-500/30 p-4 rounded-xl animate-pulse-slow">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-yellow-500/10 rounded-full">
                            <Icon name="AlertCircle" size={20} className="text-yellow-400" />
                        </div>
                        <div>
                            <span className="text-yellow-200 font-bold block">
                                Tienes cambios sin guardar
                            </span>
                            <p className="text-sm text-yellow-200/70 mt-0.5 leading-tight">
                                No olvides guardar tu configuración antes de salir.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* MENSAJE: ÉXITO / GUARDADO */}
            {!hasChanges && !isSaving && (
                <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-xl">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-500/10 rounded-full">
                            <Icon name="CheckCircle" size={20} className="text-green-400" />
                        </div>
                        <div>
                            <span className="text-green-200 font-bold block">
                                Configuración guardada
                            </span>
                            <p className="text-sm text-green-200/70 mt-0.5 leading-tight">
                                Tus preferencias están listas para el próximo juego.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConfigurationActions;