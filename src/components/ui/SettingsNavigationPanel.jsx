import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { Checkbox } from './Checkbox';
import Select from './Select';
import Icon from '../AppIcon';

const SettingsNavigationPanel = () => {
    const navigate = useNavigate();

    // Settings state
    const [settings, setSettings] = useState({
        categories: {
            truth: true,
            dare: true,
            drink: true,
            social: true,
            creative: false,
            spicy: false
        },
        difficulty: 'medium',
        gameLength: 'standard',
        playerTurnOrder: 'random',
        enableTimer: false,
        timerDuration: 30,
        enableSounds: true,
        enableVibration: true
    });

    const [hasChanges, setHasChanges] = useState(false);

    // Load settings from localStorage on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem('kamikazeGameSettings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    // Track changes
    useEffect(() => {
        const savedSettings = localStorage.getItem('kamikazeGameSettings');
        const currentSettings = JSON.stringify(settings);
        const originalSettings = savedSettings || JSON.stringify(settings);
        setHasChanges(currentSettings !== originalSettings);
    }, [settings]);

    const categoryOptions = [
        { id: 'truth', label: 'Truth Questions', description: 'Personal questions and confessions' },
        { id: 'dare', label: 'Dare Challenges', description: 'Fun physical challenges' },
        { id: 'drink', label: 'Drinking Rules', description: 'Sip, chug, and drinking games' },
        { id: 'social', label: 'Social Challenges', description: 'Group activities and interactions' },
        { id: 'creative', label: 'Creative Tasks', description: 'Drawing, singing, and performance' },
        { id: 'spicy', label: 'Spicy Content', description: 'Adult-oriented challenges (18+)' }
    ];

    const difficultyOptions = [
        { value: 'easy', label: 'Easy', description: 'Light and fun challenges' },
        { value: 'medium', label: 'Medium', description: 'Balanced mix of challenges' },
        { value: 'hard', label: 'Hard', description: 'Intense and bold challenges' }
    ];

    const gameLengthOptions = [
        { value: 'quick', label: 'Quick (10 rounds)', description: '10-15 minutes' },
        { value: 'standard', label: 'Standard (20 rounds)', description: '20-30 minutes' },
        { value: 'extended', label: 'Extended (30 rounds)', description: '30-45 minutes' }
    ];

    const turnOrderOptions = [
        { value: 'random', label: 'Random Order', description: 'Shuffled each round' },
        { value: 'clockwise', label: 'Clockwise', description: 'Fixed rotation' },
        { value: 'counterclockwise', label: 'Counter-clockwise', description: 'Reverse rotation' }
    ];

    const timerOptions = [
        { value: 15, label: '15 seconds' },
        { value: 30, label: '30 seconds' },
        { value: 45, label: '45 seconds' },
        { value: 60, label: '1 minute' }
    ];

    const handleCategoryToggle = (categoryId, checked) => {
        setSettings(prev => ({
            ...prev,
            categories: {
                ...prev?.categories,
                [categoryId]: checked
            }
        }));
    };

    const handleSettingChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSaveSettings = () => {
        localStorage.setItem('kamikazeGameSettings', JSON.stringify(settings));
        setHasChanges(false);

        // Show success feedback
        const button = document.getElementById('save-button');
        if (button) {
            button.textContent = 'Saved!';
            setTimeout(() => {
                button.textContent = 'Save Settings';
            }, 2000);
        }
    };

    const handleResetSettings = () => {
        const defaultSettings = {
            categories: {
                truth: true,
                dare: true,
                drink: true,
                social: true,
                creative: false,
                spicy: false
            },
            difficulty: 'medium',
            gameLength: 'standard',
            playerTurnOrder: 'random',
            enableTimer: false,
            timerDuration: 30,
            enableSounds: true,
            enableVibration: true
        };

        setSettings(defaultSettings);
        localStorage.removeItem('kamikazeGameSettings');
    };

    const handleBackToHome = () => {
        navigate('/home-dashboard');
    };

    const activeCategoriesCount = Object.values(settings?.categories)?.filter(Boolean)?.length;

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-heading text-2xl text-text-primary mb-2">
                        Game Settings
                    </h1>
                    <p className="text-text-secondary">
                        Customize your Kamikaze experience
                    </p>
                </div>
                <Button
                    variant="ghost"
                    onClick={handleBackToHome}
                    className="text-text-secondary hover:text-text-primary"
                >
                    <Icon name="ArrowLeft" size={18} />
                    <span className="ml-2 hidden sm:inline">Back</span>
                </Button>
            </div>
            {/* Challenge Categories */}
            <div className="bg-card p-6 rounded-lg shadow-graffiti-md">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-body font-semibold text-lg text-text-primary">
                        Challenge Categories
                    </h2>
                    <div className="text-sm text-text-secondary">
                        {activeCategoriesCount} of {categoryOptions?.length} active
                    </div>
                </div>

                <div className="space-y-4">
                    {categoryOptions?.map((category) => (
                        <div key={category?.id} className="flex items-start space-x-3">
                            <Checkbox
                                checked={settings?.categories?.[category?.id]}
                                onChange={(e) => handleCategoryToggle(category?.id, e?.target?.checked)}
                                className="mt-1"
                            />
                            <div className="flex-1">
                                <label className="font-medium text-text-primary cursor-pointer">
                                    {category?.label}
                                </label>
                                <p className="text-sm text-text-secondary mt-1">
                                    {category?.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Game Configuration */}
            <div className="bg-card p-6 rounded-lg shadow-graffiti-md">
                <h2 className="font-body font-semibold text-lg text-text-primary mb-4">
                    Game Configuration
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                        label="Difficulty Level"
                        description="Intensity of challenges"
                        options={difficultyOptions}
                        value={settings?.difficulty}
                        onChange={(value) => handleSettingChange('difficulty', value)}
                    />

                    <Select
                        label="Game Length"
                        description="Number of challenge rounds"
                        options={gameLengthOptions}
                        value={settings?.gameLength}
                        onChange={(value) => handleSettingChange('gameLength', value)}
                    />

                    <Select
                        label="Turn Order"
                        description="How players take turns"
                        options={turnOrderOptions}
                        value={settings?.playerTurnOrder}
                        onChange={(value) => handleSettingChange('playerTurnOrder', value)}
                    />

                    {settings?.enableTimer && (
                        <Select
                            label="Timer Duration"
                            description="Time limit per challenge"
                            options={timerOptions}
                            value={settings?.timerDuration}
                            onChange={(value) => handleSettingChange('timerDuration', value)}
                        />
                    )}
                </div>
            </div>
            {/* Game Features */}
            <div className="bg-card p-6 rounded-lg shadow-graffiti-md">
                <h2 className="font-body font-semibold text-lg text-text-primary mb-4">
                    Game Features
                </h2>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="font-medium text-text-primary">
                                Challenge Timer
                            </label>
                            <p className="text-sm text-text-secondary">
                                Add time pressure to challenges
                            </p>
                        </div>
                        <Checkbox
                            checked={settings?.enableTimer}
                            onChange={(e) => handleSettingChange('enableTimer', e?.target?.checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <label className="font-medium text-text-primary">
                                Sound Effects
                            </label>
                            <p className="text-sm text-text-secondary">
                                Audio feedback and notifications
                            </p>
                        </div>
                        <Checkbox
                            checked={settings?.enableSounds}
                            onChange={(e) => handleSettingChange('enableSounds', e?.target?.checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <label className="font-medium text-text-primary">
                                Haptic Feedback
                            </label>
                            <p className="text-sm text-text-secondary">
                                Vibration on interactions
                            </p>
                        </div>
                        <Checkbox
                            checked={settings?.enableVibration}
                            onChange={(e) => handleSettingChange('enableVibration', e?.target?.checked)}
                        />
                    </div>
                </div>
            </div>
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Button
                    id="save-button"
                    variant="default"
                    onClick={handleSaveSettings}
                    disabled={!hasChanges}
                    className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                    <Icon name="Save" size={18} />
                    <span className="ml-2">Save Settings</span>
                </Button>

                <Button
                    variant="outline"
                    onClick={handleResetSettings}
                    className="flex-1 border-error text-error hover:bg-error hover:text-error-foreground"
                >
                    <Icon name="RotateCcw" size={18} />
                    <span className="ml-2">Reset to Default</span>
                </Button>
            </div>
            {/* Settings Summary */}
            {hasChanges && (
                <div className="bg-warning/10 border border-warning/20 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <Icon name="AlertCircle" size={18} className="text-warning" />
                        <span className="text-warning font-medium">
                            You have unsaved changes
                        </span>
                    </div>
                    <p className="text-sm text-text-secondary mt-1">
                        Don't forget to save your settings before starting a game.
                    </p>
                </div>
            )}
        </div>
    );
};

export default SettingsNavigationPanel;