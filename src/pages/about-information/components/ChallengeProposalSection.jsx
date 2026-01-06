/**
 * @file ChallengeProposalSection.jsx
 * @description Componente que muestra una tarjeta invitando a los usuarios a proponer nuevos retos para el juego.
 * Al hacer clic en el botón, se abre un Google Form en una nueva pestaña.
 */

import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ChallengeProposalSection = () => {
    // Estado para mostrar un indicador de carga en el botón mientras se abre el formulario.
    // Esto le da al usuario una respuesta visual inmediata de que su clic funcionó.
    const [isFormOpening, setIsFormOpening] = useState(false);

    /**
     * Manejador que se ejecuta al hacer clic en el botón "Proponer un Reto".
     */
    const handleProposalClick = () => {
        // 1. Activamos el estado de carga para que el botón muestre un spinner.
        setIsFormOpening(true);

        // 2. Aquí está tu URL real del Google Form que creaste.
        const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdh8UgeB7FeJ8oH1MrXoAAnJItzh572sRPuLkghbR8xUvkWFg/viewform?usp=dialog";

        // 3. Usamos un pequeño temporizador (medio segundo) para que el usuario alcance a ver la animación de carga.
        //    Esto mejora la experiencia de usuario (UX).
        setTimeout(() => {
            // 4. Abrimos el formulario en una nueva pestaña del navegador.
            //    'noopener' y 'noreferrer' son atributos de seguridad importantes al abrir nuevos enlaces.
            window.open(googleFormUrl, '_blank', 'noopener,noreferrer');

            // 5. Desactivamos el estado de carga una vez que el enlace se ha abierto.
            setIsFormOpening(false);
        }, 500);
    };

    return (
        // Contenedor principal de la sección con un fondo degradado y estilos visuales.
        <div className="bg-gradient-to-br from-accent/10 to-primary/10 p-6 rounded-lg shadow-graffiti-lg mb-8 border border-accent/20">
            <div className="text-center">
                {/* Ícono de la bombilla */}
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-graffiti-md">
                    <Icon name="Lightbulb" size={28} className="text-white" />
                </div>

                {/* Título principal de la sección */}
                <h3 className="font-heading text-2xl text-accent mb-3">
                    ¡Contribuye con la Comunidad!
                </h3>

                {/* Textos que invitan al usuario a participar */}
                <p className="font-body text-text-primary mb-2">
                    ¿Tienes una idea genial para un nuevo reto?
                </p>
                <p className="font-body text-text-secondary mb-6 max-w-md mx-auto">
                    En Kamikaze! sabemos que la comunidad es súper ingeniosa. ¡Déjanos aquí tus propuestas para nuevos retos!
                    <br /><br />
                    <span className="font-semibold">Tu privacidad es primero: todas las propuestas son 100% anónimas y no recopilamos ningún dato personal.</span>
                </p>

                {/* Botón principal de acción */}
                <Button
                    variant="default"
                    size="lg"
                    onClick={handleProposalClick}
                    loading={isFormOpening} // La prop 'loading' mostrará un spinner cuando isFormOpening sea true.
                    className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 shadow-graffiti-md hover:shadow-graffiti-lg transition-all duration-300"
                >
                    <Icon name="Plus" size={20} />
                    <span className="ml-2 font-semibold">Proponer un Reto</span>
                </Button>

                {/* Pequeños íconos con información adicional (tiempo, comunidad, etc.) */}
                <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-text-secondary">
                    <div className="flex items-center space-x-1">
                        <Icon name="Clock" size={14} />
                        <span>2 minutos</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Icon name="Users" size={14} />
                        <span>Comunidad global</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Icon name="Heart" size={14} />
                        <span>Gratis</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChallengeProposalSection;