import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ContextualBackNavigation from '../../components/ui/ContextualBackNavigation';
import CategoryToggleSection from './components/CategoryToggleSection';
import ThemeSwitcher from './components/ThemeSwitcher';
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

    const [theme, setTheme] = useState('dark');

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
        const savedTheme = localStorage.getItem('kamikazeTheme');
        const savedGameplay = localStorage.getItem('kamikazeGameplaySettings');

        if (savedCategories) {
            setCategories(JSON.parse(savedCategories));
        }

        if (savedTheme) {
            setTheme(savedTheme);
        }

        if (savedGameplay) {
            setGameplaySettings(JSON.parse(savedGameplay));
        }

        // Store original settings for comparison
        setOriginalSettings({
            categories: savedCategories ? JSON.parse(savedCategories) : categories,
            theme: savedTheme || theme,
            gameplay: savedGameplay ? JSON.parse(savedGameplay) : gameplaySettings
        });
    }, []);

    // Track changes
    useEffect(() => {
        if (originalSettings) {
            const currentSettings = {
                categories,
                theme,
                gameplay: gameplaySettings
            };

            const hasChanged = JSON.stringify(currentSettings) !== JSON.stringify(originalSettings);
            setHasChanges(hasChanged);
        }
    }, [categories, theme, gameplaySettings, originalSettings]);

    const handleCategoryChange = (categoryId, enabled) => {
        setCategories((prev) => ({
            ...prev,
            [categoryId]: enabled
        }));
    };

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        document.documentElement?.setAttribute('data-theme', newTheme);
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
            localStorage.setItem('kamikazeTheme', theme);
            localStorage.setItem('kamikazeGameplaySettings', JSON.stringify(gameplaySettings));

            setOriginalSettings({
                categories,
                theme,
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
        setTheme('dark');
        setGameplaySettings(defaultGameplay);

        localStorage.removeItem('kamikazeCategories');
        localStorage.removeItem('kamikazeTheme');
        localStorage.removeItem('kamikazeGameplaySettings');

        document.documentElement?.setAttribute('data-theme', 'dark');
    };

    const handleBackToHome = () => {
        navigate('/home-dashboard');
    };

    const activeCategoriesCount = Object.values(categories)?.filter(Boolean)?.length;

    return (
        <div className="min-h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden"
            style={{ backgroundImage: `url(${bgImage})` }}>

            {/* ✅ Capa de oscurecimiento */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>

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
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full shadow-graffiti-lg mb-4">
                            <Icon name="Settings" size={32} className="text-white" />
                        </div>
                        <h1 className="font-heading text-3xl sm:text-4xl text-text-primary mb-2">
                            Configuración
                        </h1>
                        <p className="text-text-secondary text-lg">
                            Personaliza tu experiencia Kamikaze
                        </p>
                    </div>

                    {/* Configuration Summary */}
                    <div className="bg-surface/50 p-4 rounded-lg border border-border/30 mb-8">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <Icon name="Target" size={16} className="text-primary" />
                                    <span className="text-text-secondary">Categorías:</span>
                                    <span className="font-data text-text-primary">{activeCategoriesCount}/3</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Icon name="Palette" size={16} className="text-accent" />
                                    <span className="text-text-secondary">Tema:</span>
                                    <span className="font-data text-text-primary capitalize">{theme}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Configuration Sections */}
                    <div className="space-y-8">
                        <CategoryToggleSection
                            categories={categories}
                            onCategoryChange={handleCategoryChange} />

                        <ThemeSwitcher
                            currentTheme={theme}
                            onThemeChange={handleThemeChange} />

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