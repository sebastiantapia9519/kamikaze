import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from './Button';
import Icon from '../AppIcon';

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const navigationItems = [
        { path: '/home-dashboard', label: 'Home', icon: 'Home' },
        { path: '/player-setup', label: 'Play', icon: 'Users' },
        { path: '/game-configuration', label: 'Settings', icon: 'Settings' },
        { path: '/about-information', label: 'About', icon: 'Info' }];


    const isActive = (path) => location?.pathname === path;

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Don't show header on age verification page
    if (location?.pathname === '/age-verification-disclaimer') {
        return null;
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-200 bg-background/95 backdrop-blur-sm border-b border-border">
            <div className="w-full px-4 sm:px-6 lg:px-8 hidden">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/home-dashboard" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-graffiti-sm">
                            <svg
                                viewBox="0 0 24 24"
                                className="w-6 h-6 text-white"
                                fill="currentColor">

                                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
                            </svg>
                        </div>
                        <span className="font-heading text-xl text-primary hidden sm:block">
                            Kamikaze!
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {navigationItems?.map((item) =>
                            <Link
                                key={item?.path}
                                to={item?.path}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive(item?.path) ?
                                        'bg-primary text-primary-foreground shadow-graffiti-sm' :
                                        'text-text-secondary hover:text-text-primary hover:bg-surface/50'}`
                                }>

                                <Icon name={item?.icon} size={18} />
                                <span className="font-body font-medium">{item?.label}</span>
                            </Link>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleMobileMenu}
                        className="md:hidden"
                        aria-label="Toggle mobile menu">

                        <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} className="hidden" />
                    </Button>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen &&
                    <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm">
                        <nav className="py-4 space-y-2">
                            {navigationItems?.map((item) =>
                                <Link
                                    key={item?.path}
                                    to={item?.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive(item?.path) ?
                                            'bg-primary text-primary-foreground shadow-graffiti-sm' :
                                            'text-text-secondary hover:text-text-primary hover:bg-surface/50'}`
                                    }>

                                    <Icon name={item?.icon} size={20} />
                                    <span className="font-body font-medium">{item?.label}</span>
                                </Link>
                            )}
                        </nav>
                    </div>
                }
            </div>
        </header>);

};

export default Header;