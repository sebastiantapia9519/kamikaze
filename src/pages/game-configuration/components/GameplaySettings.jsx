import React from 'react';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const GameplaySettings = ({ settings, onSettingChange }) => {

    const gameLengthOptions = [
        { value: 'quick', label: 'Rápido (15 retos)', description: '10-15 minutos' },
        { value: 'standard', label: 'Estándar (30 retos)', description: '20-30 minutos' },
        { value: 'extended', label: 'Extendido (45 retos)', description: '30-45 minutos' }
    ];

    const turnOrderOptions = [
        { value: 'random', label: 'Orden Aleatorio', description: 'Mezclado cada ronda' },
        { value: 'clockwise', label: 'Sentido Horario', description: 'Rotación fija' },
        { value: 'counterclockwise', label: 'Sentido Antihorario', description: 'Rotación inversa' }
    ];

    return (
        // CONTENEDOR PRINCIPAL: Negro profundo (bg-gray-900)
        <div className="bg-gray-900 p-6 rounded-2xl shadow-xl border border-white/10">

            {/* ENCABEZADO */}
            <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gray-800 rounded-lg border border-white/5">
                    <Icon name="Settings" size={24} className="text-white" />
                </div>
                <div>
                    <h2 className="font-bold text-xl text-white">
                        Configuración de Juego
                    </h2>
                    <p className="text-gray-400 text-sm">
                        Personaliza la experiencia de juego
                    </p>
                </div>
            </div>

            <div className="space-y-6">

                {/* SELECTORES (Duración y Orden) */}
                {/* Nota: Asegúrate de que tu componente Select soporte texto blanco internamente. 
                    Si no, tendríamos que editar el Select también. */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                        label="Duración del Juego"
                        description="Número de retos por sesión"
                        options={gameLengthOptions}
                        value={settings?.gameLength}
                        onChange={(value) => onSettingChange('gameLength', value)}
                        className="w-full text-white"
                    />

                    <Select
                        label="Orden de Turnos"
                        description="Cómo se alternan los jugadores"
                        options={turnOrderOptions}
                        value={settings?.turnOrder}
                        onChange={(value) => onSettingChange('turnOrder', value)}
                        className="w-full text-white"
                    />
                </div>

                {/* OPCIONES EXTRA (Switches/Checkboxes) */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                    <h3 className="font-bold text-white flex items-center space-x-2 mb-4">
                        <Icon name="Zap" size={18} className="text-yellow-400" />
                        <span>Características del Juego</span>
                    </h3>

                    <div className="space-y-3">
                        {/* Temporizador (Oculto en tu código original, pero estilizado por si acaso) */}
                        <div className="items-center justify-between p-4 bg-gray-800 rounded-xl border border-white/5 hidden">
                            <div className="flex items-start space-x-3">
                                <Icon name="Timer" size={20} className="text-yellow-400 mt-1" />
                                <div>
                                    <label className="font-bold text-white block">
                                        Temporizador de Retos
                                    </label>
                                    <p className="text-sm text-gray-400">
                                        Añade presión de tiempo a los desafíos
                                    </p>
                                </div>
                            </div>
                            <Checkbox
                                checked={settings?.enableTimer}
                                onChange={(e) => onSettingChange('enableTimer', e?.target?.checked)}
                                size="lg"
                                className="border-white/30 data-[state=checked]:bg-yellow-500"
                            />
                        </div>

                        {/* Sonidos */}
                        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl border border-white/5 transition-colors hover:bg-gray-800/80">
                            <div className="flex items-start space-x-3">
                                <Icon name="Volume2" size={20} className="text-cyan-400 mt-1" />
                                <div>
                                    <label className="font-bold text-white block">
                                        Efectos de Sonido
                                    </label>
                                    <p className="text-sm text-gray-400">
                                        Sonidos y notificaciones de audio
                                    </p>
                                </div>
                            </div>
                            <Checkbox
                                checked={settings?.enableSounds}
                                onChange={(e) => onSettingChange('enableSounds', e?.target?.checked)}
                                size="lg"
                                className="border-white/30 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                            />
                        </div>

                        {/* Vibración */}
                        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl border border-white/5 transition-colors hover:bg-gray-800/80">
                            <div className="flex items-start space-x-3">
                                <Icon name="Smartphone" size={20} className="text-pink-400 mt-1" />
                                <div>
                                    <label className="font-bold text-white block">
                                        Vibración
                                    </label>
                                    <p className="text-sm text-gray-400">
                                        Retroalimentación háptica en interacciones
                                    </p>
                                </div>
                            </div>
                            <Checkbox
                                checked={settings?.enableVibration}
                                onChange={(e) => onSettingChange('enableVibration', e?.target?.checked)}
                                size="lg"
                                className="border-white/30 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameplaySettings;