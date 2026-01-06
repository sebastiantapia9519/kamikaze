import React from 'react';
import Icon from '../../../components/AppIcon';
// 👇 IMPORTACIÓN DEL LOGO (Asegúrate que esta ruta coincida con tu carpeta assets)
import kamikazeLogo from '../../../assets/images/iconKamikaze180x180.png';

const PlayerTurnIndicator = ({ currentPlayer, players = [], challenge }) => {
    const getAssignmentText = () => {
        if (challenge?.category === 'Multiplayer') {
            if (challenge?.assignedPlayers?.length) {
                const playerNames = challenge?.assignedPlayers?.join(', ');
                return `👥 ${playerNames}`;
            }
            return '👥 Todos los jugadores';
        }

        return `👉 ${currentPlayer?.name || 'Jugador'}`;
    };

    const getCategoryColor = () => {
        switch (challenge?.category) {
            case 'Regular':
                return 'from-secondary to-secondary/80';
            case 'Epic':
                return 'from-warning to-warning/80';
            case 'Multiplayer':
                return 'from-primary to-accent';
            default:
                return 'from-primary to-accent';
        }
    };

    const getCategoryIcon = () => {
        switch (challenge?.category) {
            case 'Regular':
                return 'User';
            case 'Epic':
                return 'Zap';
            case 'Multiplayer':
                return 'Users';
            default:
                return 'User';
        }
    };

    return (
        <div className="space-y-4">

            {/* Current Turn */}
            <div className={`bg-gradient-to-r ${getCategoryColor()} p-4 rounded-xl shadow-graffiti-md text-white text-center relative overflow-hidden border border-white/10`}>
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="w-full h-full" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20s-20-8.954-20-20 8.954-20 20-20 20 8.954 20 20zm-20-18c-9.941 0-18 8.059-18 18s8.059 18 18 18 18-8.059 18-18-8.059-18-18-18z'/%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '40px 40px'
                    }}></div>
                </div>

                <div className="relative z-10 flex items-center justify-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Icon name={getCategoryIcon()} size={20} className="text-white" />
                    </div>
                    <div className="text-left">
                        <div className="font-heading text-lg font-bold drop-shadow-sm">
                            {getAssignmentText()}, tu reto es:
                        </div>
                        <div className="text-sm text-white/90 font-medium">
                            Categoría: {challenge?.category || 'Regular'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Players Overview */}
            <div className="flex flex-wrap justify-center gap-2">
                {players?.map((player, index) => (
                    <div
                        key={player?.id || index}
                        className={`px-3 py-2 rounded-lg border transition-all duration-200 ${player?.id === currentPlayer?.id
                            ? 'bg-primary text-primary-foreground border-primary shadow-graffiti-sm ring-2 ring-primary/30'
                            : 'bg-surface/50 text-text-secondary border-border hover:bg-surface'
                            }`}
                    >
                        <div className="flex items-center space-x-2">
                            <Icon
                                name={player?.id === currentPlayer?.id ? 'Star' : 'User'}
                                size={16}
                            />
                            <span className="font-body font-medium text-sm">
                                {player?.name}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlayerTurnIndicator;