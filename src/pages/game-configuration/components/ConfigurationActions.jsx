import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

/**
 * Componente que renderiza los botones de acción para la configuración (Guardar, Restablecer)
 * y muestra alertas visuales según el estado de los cambios (guardados, sin guardar).
 * 
 * @param {Object} props
 * @param {boolean} props.hasChanges - Indica si hay cambios no guardados en la configuración.
 * @param {Function} props.onSave - Callback ejecutado al hacer clic en "Guardar Cambios".
 * @param {Function} props.onReset - Callback ejecutado al hacer clic en "Restablecer".
 * @param {Function} props.onBackToHome - Callback ejecutado al hacer clic en volver al inicio.
 * @param {boolean} [props.isSaving=false] - Estado de carga durante el guardado.
 */
const ConfigurationActions = ({
    hasChanges,
    onSave,
    onReset,
    onBackToHome,
    isSaving = false
}) => {
    return (
        <div className="space-y-6">
            {/* Acciones principales (Guardar / Restablecer) */}
            <div className="flex flex-col sm:flex-row gap-4">

                {/* Botón Guardar */}
                <Button
                    variant="default"
                    onClick={onSave}
                    disabled={!hasChanges || isSaving}
                    loading={isSaving}
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

                {/* Botón Restablecer */}
                <Button
                    variant="outline"
                    onClick={onReset}
                    className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500 hover:text-red-300 transition-all font-bold"
                >
                    <Icon name="RotateCcw" size={18} />
                    <span className="ml-2">Restablecer</span>
                </Button>
            </div>

            {/* Acciones de navegación (Ocultos según el diseño original, pero preservados) */}
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

            {/* Mensaje: Cambios sin guardar */}
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

            {/* Mensaje: Éxito / Guardado */}
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