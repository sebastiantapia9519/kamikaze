import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from './Button';
import Icon from '../AppIcon';

const ContextualBackNavigation = ({
    customBackPath = null,
    customLabel = null,
    showBreadcrumb = true,
    className = ""
}) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Define navigation context based on current path
    const getNavigationContext = () => {
        const path = location?.pathname;

        switch (path) {
            case '/game-configuration':
                return {
                    backPath: customBackPath || '/home-dashboard',
                    label: customLabel || 'Back to Home',
                    breadcrumb: 'Home > Settings',
                    icon: 'ArrowLeft'
                };
            case '/about-information':
                return {
                    backPath: customBackPath || '/home-dashboard',
                    label: customLabel || 'Back to Home',
                    breadcrumb: 'Home > About',
                    icon: 'ArrowLeft'
                };
            case '/player-setup':
                return {
                    backPath: customBackPath || '/home-dashboard',
                    label: customLabel || 'Back to Home',
                    breadcrumb: 'Home > Player Setup',
                    icon: 'ArrowLeft'
                };
            case '/active-game-session':
                return {
                    backPath: customBackPath || '/player-setup',
                    label: customLabel || 'Back to Setup',
                    breadcrumb: 'Home > Setup > Game',
                    icon: 'ArrowLeft'
                };
            default:
                return {
                    backPath: customBackPath || '/home-dashboard',
                    label: customLabel || 'Back',
                    breadcrumb: 'Home',
                    icon: 'ArrowLeft'
                };
        }
    };

    const context = getNavigationContext();

    const handleBack = () => {
        navigate(context?.backPath);
    };

    // Don't show on home dashboard or age verification
    if (location?.pathname === '/home-dashboard' || location?.pathname === '/age-verification-disclaimer') {
        return null;
    }

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Breadcrumb */}
            {showBreadcrumb &&
                <nav className="items-center space-x-2 text-sm text-text-secondary hidden">
                    <Icon name="Home" size={14} />
                    <span>{context?.breadcrumb}</span>
                </nav>
            }
            {/* Back Button */}
            <div className="flex items-center justify-between mt-0">
                <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="text-text-secondary hover:text-text-primary p-0 h-auto">

                    <Icon name={context?.icon} size={18} />
                    <span className="ml-2">{context?.label}</span>
                </Button>

                {/* Optional: Show current page indicator */}
                <div className="hidden sm:flex items-center space-x-2 text-sm text-text-secondary">
                    <Icon name="MapPin" size={14} />
                    <span>
                        {location?.pathname === '/game-configuration' && 'Game Settings'}
                        {location?.pathname === '/about-information' && 'About & Rules'}
                        {location?.pathname === '/player-setup' && 'Player Setup'}
                        {location?.pathname === '/active-game-session' && 'Active Game'}
                    </span>
                </div>
            </div>
        </div>);

};

export default ContextualBackNavigation;