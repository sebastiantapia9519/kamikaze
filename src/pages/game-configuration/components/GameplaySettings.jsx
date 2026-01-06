import React from 'react';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const GameplaySettings = ({ settings, onSettingChange }) => {



    const gameLengthOptions = [
        { value: 'quick', label: 'Rápido (15 retos)', description: '10-15 minutos' },
        { value: 'standard', label: 'Estándar (30 retos)', description: '20-30 minutos' },
        { value: 'extended', label: 'Extendido (45 retos)', description: '30-45 minutos' }];


    const turnOrderOptions = [
        { value: 'random', label: 'Orden Aleatorio', description: 'Mezclado cada ronda' },
        { value: 'clockwise', label: 'Sentido Horario', description: 'Rotación fija' },
        { value: 'counterclockwise', label: 'Sentido Antihorario', description: 'Rotación inversa' }];


    return (
        <div className="bg-card/80 backdrop-blur-sm p-6 rounded-lg shadow-graffiti-md border border-border/50">
            <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-secondary/20 rounded-lg">
                    <Icon name="Settings" size={24} className="text-secondary" />
                </div>
                <div>
                    <h2 className="font-heading text-xl text-text-primary">
                        Configuración de Juego
                    </h2>
                    <p className="text-text-secondary text-sm">
                        Personaliza la experiencia de juego
                    </p>
                </div>
            </div>
            <div className="space-y-6">

                {/* Game Configuration Selects */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                    <Select
                        label="Duración del Juego"
                        description="Número de retos por sesión"
                        options={gameLengthOptions}
                        value={settings?.gameLength}
                        onChange={(value) => onSettingChange('gameLength', value)}
                        className="w-full" />

                </div>

                <Select
                    label="Orden de Turnos"
                    description="Cómo se alternan los jugadores"
                    options={turnOrderOptions}
                    value={settings?.turnOrder}
                    onChange={(value) => onSettingChange('turnOrder', value)}
                    className="w-full" />


                {/* Game Features */}
                <div className="space-y-4 pt-4 border-t border-border/30">
                    <h3 className="font-body font-semibold text-text-primary flex items-center space-x-2">
                        <Icon name="Zap" size={18} className="text-accent" />
                        <span>Características del Juego</span>
                    </h3>

                    <div className="space-y-4">
                        <div className="items-center justify-between p-4 bg-surface/30 rounded-lg hidden">
                            <div className="flex items-start space-x-3">
                                <Icon name="Timer" size={20} className="text-warning mt-1" />
                                <div>
                                    <label className="font-medium text-text-primary block">
                                        Temporizador de Retos
                                    </label>
                                    <p className="text-sm text-text-secondary">
                                        Añade presión de tiempo a los desafíos
                                    </p>
                                </div>
                            </div>
                            <Checkbox
                                checked={settings?.enableTimer}
                                onChange={(e) => onSettingChange('enableTimer', e?.target?.checked)}
                                size="lg" />

                        </div>

                        <div className="flex items-center justify-between p-4 bg-surface/30 rounded-lg">
                            <div className="flex items-start space-x-3">
                                <Icon name="Volume2" size={20} className="text-primary mt-1" />
                                <div>
                                    <label className="font-medium text-text-primary block">
                                        Efectos de Sonido
                                    </label>
                                    <p className="text-sm text-text-secondary">
                                        Sonidos y notificaciones de audio
                                    </p>
                                </div>
                            </div>
                            <Checkbox
                                checked={settings?.enableSounds}
                                onChange={(e) => onSettingChange('enableSounds', e?.target?.checked)}
                                size="lg" />

                        </div>

                        <div className="flex items-center justify-between p-4 bg-surface/30 rounded-lg">
                            <div className="flex items-start space-x-3">
                                <Icon name="Smartphone" size={20} className="text-accent mt-1" />
                                <div>
                                    <label className="font-medium text-text-primary block">
                                        Vibración
                                    </label>
                                    <p className="text-sm text-text-secondary">
                                        Retroalimentación háptica en interacciones
                                    </p>
                                </div>
                            </div>
                            <Checkbox
                                checked={settings?.enableVibration}
                                onChange={(e) => onSettingChange('enableVibration', e?.target?.checked)}
                                size="lg" />

                        </div>
                    </div>
                </div>
            </div>
        </div>);

};

export default GameplaySettings;