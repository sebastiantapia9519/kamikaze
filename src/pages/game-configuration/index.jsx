import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ContextualBackNavigation from '../../components/ui/ContextualBackNavigation';
import CategoryToggleSection from './components/CategoryToggleSection';
// Se eliminó ThemeSwitcher
import GameplaySettings from './components/GameplaySettings';
import ConfigurationActions from './components/ConfigurationActions';
import Icon from '../../components/AppIcon';
import bgImage from '../../assets/images/graffiti-bg.png';

const GameConfiguration = () => {
    const navigate = useNavigate();

    // Configuration state
    const [categories, setCategories] = useState({
        regular: true,
        epic: true,
        multiplayer: true
    });

    // Se eliminó el estado 'theme'

    const [gameplaySettings, setGameplaySettings] = useState({
        difficulty: 'medium',
        gameLength: 'standard',
        turnOrder: 'random',
        enableTimer: false,
        enableSounds: true,
        enableVibration: true
    });

    const [hasChanges, setHasChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [originalSettings, setOriginalSettings] = useState(null);

    // Load settings from localStorage on mount
    useEffect(() => {
        const savedCategories = localStorage.getItem('kamikazeCategories');
        const savedGameplay = localStorage.getItem('kamikazeGameplaySettings');

        if (savedCategories) {
            setCategories(JSON.parse(savedCategories));
        }

        if (savedGameplay) {
            setGameplaySettings(JSON.parse(savedGameplay));
        }

        // Store original settings for comparison
        setOriginalSettings({
            categories: savedCategories ? JSON.parse(savedCategories) : categories,
            gameplay: savedGameplay ? JSON.parse(savedGameplay) : gameplaySettings
        });
    }, []);

    // Track changes
    useEffect(() => {
        if (originalSettings) {
            const currentSettings = {
                categories,
                gameplay: gameplaySettings
            };

            const hasChanged = JSON.stringify(currentSettings) !== JSON.stringify(originalSettings);
            setHasChanges(hasChanged);
        }
    }, [categories, gameplaySettings, originalSettings]);

    const handleCategoryChange = (categoryId, enabled) => {
        setCategories((prev) => ({
            ...prev,
            [categoryId]: enabled
        }));
    };

    const handleGameplaySettingChange = (key, value) => {
        setGameplaySettings((prev) => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSaveSettings = async () => {
        setIsSaving(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            localStorage.setItem('kamikazeCategories', JSON.stringify(categories));
            // Se eliminó guardado de theme
            localStorage.setItem('kamikazeGameplaySettings', JSON.stringify(gameplaySettings));

            setOriginalSettings({
                categories,
                gameplay: gameplaySettings
            });

            setHasChanges(false);
        } catch (error) {
            console.error('Error saving settings:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleResetSettings = () => {
        const defaultCategories = {
            regular: true,
            epic: true,
            multiplayer: true
        };

        const defaultGameplay = {
            difficulty: 'medium',
            gameLength: 'standard',
            turnOrder: 'random',
            enableTimer: false,
            enableSounds: true,
            enableVibration: true
        };

        setCategories(defaultCategories);
        setGameplaySettings(defaultGameplay);

        localStorage.removeItem('kamikazeCategories');
        // Se eliminó borrado de theme
        localStorage.removeItem('kamikazeGameplaySettings');
    };

    const handleBackToHome = () => {
        navigate('/home-dashboard');
    };

    const activeCategoriesCount = Object.values(categories)?.filter(Boolean)?.length;

    return (
        <div className="min-h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden"
            style={{ backgroundImage: `url(${bgImage})` }}>

            {/* Capa de oscurecimiento */}
            <div className="absolute inset-0 bg-gray-950/90 backdrop-blur-sm"></div>

            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="pb-24 px-4 sm:px-6 lg:px-8 pt-5 relative z-10">
                <div className="max-w-4xl mx-auto">
                    {/* Back Navigation */}
                    <div className="mb-8">
                        <ContextualBackNavigation />
                    </div>

                    {/* Page Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full shadow-lg shadow-cyan-500/20 mb-4 animate-pulse-glow">
                            <Icon name="Settings" size={32} className="text-white" />
                        </div>
                        <h1 className="font-heading text-3xl sm:text-4xl text-white mb-2 drop-shadow-md">
                            Configuración
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Personaliza tu experiencia Kamikaze
                        </p>
                    </div>

                    {/* Configuration Summary - TARJETA NEGRA SÓLIDA */}
                    <div className="bg-gray-900 p-4 rounded-xl border border-white/10 mb-8 shadow-lg">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex flex-wrap gap-4 justify-center sm:justify-start w-full">
                                {/* Badge de Categorías */}
                                <div className="flex items-center space-x-2 bg-gray-800/50 px-3 py-1.5 rounded-lg border border-white/5">
                                    <Icon name="Target" size={16} className="text-cyan-400" />
                                    <span className="text-gray-400">Categorías:</span>
                                    <span className="font-bold text-white">{activeCategoriesCount}/3</span>
                                </div>
                                {/* Se eliminó el Badge de Tema */}
                            </div>
                        </div>
                    </div>

                    {/* Configuration Sections */}
                    <div className="space-y-8">
                        <CategoryToggleSection
                            categories={categories}
                            onCategoryChange={handleCategoryChange} />

                        {/* Se eliminó el componente ThemeSwitcher */}

                        <GameplaySettings
                            settings={gameplaySettings}
                            onSettingChange={handleGameplaySettingChange} />

                        <ConfigurationActions
                            hasChanges={hasChanges}
                            onSave={handleSaveSettings}
                            onReset={handleResetSettings}
                            onBackToHome={handleBackToHome}
                            isSaving={isSaving} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default GameConfiguration;