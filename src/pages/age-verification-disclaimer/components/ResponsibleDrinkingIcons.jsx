import React from 'react';
import Icon from '../../../components/AppIcon';

const ResponsibleDrinkingIcons = () => {
    const safetyIcons = [
        {
            id: 'no-driving',
            icon: 'Car',
            label: 'No Conducir',
            description: 'Nunca manejes bajo la influencia',
            color: 'text-error'
        },
        {
            id: 'know-limits',
            icon: 'Gauge',
            label: 'Conoce tus Límites',
            description: 'Bebe con moderación',
            color: 'text-warning'
        },
        {
            id: 'stay-hydrated',
            icon: 'Droplets',
            label: 'Mantente Hidratado',
            description: 'Bebe agua regularmente',
            color: 'text-primary'
        },
        {
            id: 'safe-transport',
            icon: 'Navigation',
            label: 'Transporte Seguro',
            description: 'Planifica tu regreso',
            color: 'text-success'
        }
    ];

    return (
        <div className="grid grid-cols-2 gap-4 p-4 bg-surface/30 rounded-lg border border-border/50">
            {safetyIcons?.map((item) => (
                <div key={item?.id} className="text-center space-y-2">
                    <div className="flex justify-center">
                        <div className="w-12 h-12 bg-background/50 rounded-full flex items-center justify-center">
                            <Icon name={item?.icon} size={24} className={item?.color} />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-body font-medium text-xs text-text-primary">
                            {item?.label}
                        </h3>
                        <p className="text-xs text-text-secondary mt-1">
                            {item?.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ResponsibleDrinkingIcons;