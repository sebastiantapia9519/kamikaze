import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChaosRouletteModal = ({ event, onClose }) => {
    return (
        <AnimatePresence>
            {event && (
                <motion.div className="fixed inset-0 bg-background/90 backdrop-blur-lg flex items-center justify-center z-50 p-4"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.div className="bg-card/90 border border-border/50 rounded-lg shadow-graffiti-lg max-w-md w-full text-center p-6 sm:p-8 flex flex-col"
                        initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }}>
                        <div className="flex-shrink-0">
                            <Icon name="Zap" size={40} className="text-accent mx-auto mb-4" />
                            <h2 className="font-heading text-3xl text-accent mb-2">¡Ruleta del Caos!</h2>
                            <h3 className="font-semibold text-xl text-text-primary mb-3">{event.title}</h3>
                            <p className="text-text-secondary mb-8">{event.description}</p>
                        </div>
                        <div className="flex-shrink-0">
                            <Button onClick={onClose} size="lg" className="w-full">Continuar</Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ChaosRouletteModal;