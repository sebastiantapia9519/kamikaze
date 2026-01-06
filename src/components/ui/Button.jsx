// Importa React para poder crear un componente
import React from 'react';
// Importa 'Slot' de Radix UI. Es una utilidad que permite que este componente
// "fusione" sus propiedades con un componente hijo (ver 'asChild' más abajo).
import { Slot } from "@radix-ui/react-slot";
// Importa 'cva' (Class Variance Authority), una biblioteca para crear
// variantes de clases de Tailwind CSS de forma organizada.
import { cva } from "class-variance-authority";
// Importa 'cn', una función de utilidad para fusionar nombres de clases de Tailwind
// de forma segura, especialmente útil para lógica condicional.
import { cn } from "../../utils/cn";
// Importa tu componente de íconos personalizado.
import Icon from '../AppIcon';

// --- Definición de todas las variantes de estilo del botón ---
// 'cva' define los estilos base y luego las variantes que se pueden aplicar.
const buttonVariants = cva(
    // Clases base que se aplican a TODOS los botones
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        // 'variants' define los diferentes "tipos" de botones que puedes tener.
        variants: {
            // Variante por "estilo" o "color"
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90",
                destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline: "border border-input hover:bg-accent hover:text-accent-foreground",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                success: "bg-success text-success-foreground hover:bg-success/90",
                warning: "bg-warning text-warning-foreground hover:bg-warning/90",
                danger: "bg-error text-error-foreground hover:bg-error/90",
            },
            // Variante por "tamaño"
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
                xs: "h-8 rounded-md px-2 text-xs",
                xl: "h-12 rounded-md px-10 text-base",
            },
        },
        // 'defaultVariants' especifica qué variantes usar si no se proporciona ninguna.
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

// --- Creación del componente Button ---
// Usamos React.forwardRef para permitir que este componente reciba una 'ref',
// lo cual es importante para la accesibilidad y el control del DOM.
const Button = React.forwardRef(({
    // --- Definición de todas las propiedades (props) que acepta el componente ---
    className,    // Para clases de CSS adicionales
    variant,      // El estilo del botón (default, destructive, etc.)
    size,         // El tamaño del botón (sm, lg, etc.)
    asChild = false, // Si es true, el botón se renderizará como un 'Slot'
    children,     // El contenido dentro del botón (texto, íconos, etc.)
    loading = false, // Si es true, muestra un spinner de carga
    iconName = null, // El nombre del ícono a mostrar (de tu componente Icon)
    iconPosition = 'left', // Dónde mostrar el ícono ('left' o 'right')
    iconSize = null,   // Tamaño personalizado del ícono
    fullWidth = false, // Si es true, el botón ocupa el 100% del ancho
    disabled = false,  // Si es true, deshabilita el botón
    ...props        // '...props' captura todas las demás propiedades (como onClick, type, etc.)
}, ref) => {

    // --- Lógica del Componente ---

    // Decide si el elemento raíz será un <button> o un <Slot>
    // Si 'asChild' es true, 'Comp' se convierte en 'Slot', permitiendo que
    // el botón actúe como un contenedor para otro componente (ej. un Link).
    const Comp = asChild ? Slot : "button";

    // Mapeo para calcular el tamaño del ícono basado en el tamaño del botón
    const iconSizeMap = {
        xs: 12,
        sm: 14,
        default: 16,
        lg: 18,
        xl: 20,
        icon: 16,
    };
    // Calcula el tamaño final del ícono, usando el 'iconSize' si se proveyó,
    // o el tamaño del mapa, o 16 como último recurso.
    const calculatedIconSize = iconSize || iconSizeMap?.[size] || 16;

    // Componente interno para el spinner de carga
    const LoadingSpinner = () => (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
    );

    // Función interna para renderizar el ícono
    const renderIcon = () => {
        if (!iconName) return null; // No hace nada si no hay 'iconName'
        try {
            // Renderiza el componente Icon con el nombre, tamaño y clases condicionales
            return (
                <Icon
                    name={iconName}
                    size={calculatedIconSize}
                    className={cn(
                        // Añade margen solo si hay 'children' (texto)
                        children && iconPosition === 'left' && "mr-2",
                        children && iconPosition === 'right' && "ml-2"
                    )}
                />
            );
        } catch {
            // Si el nombre del ícono es inválido, no rompe la app
            return null;
        }
    };

    // --- Lógica de Renderizado de Respaldo ---
    // Esta función se usa si 'asChild' es true pero algo falla (ej. múltiples hijos)
    const renderFallbackButton = () => (
        <button
            // 'cn' fusiona las clases base, las variantes y las clases personalizadas
            className={cn(
                buttonVariants({ variant, size, className }),
                fullWidth && "w-full" // Añade 'w-full' si 'fullWidth' es true
            )}
            ref={ref} // Pasa la 'ref' al elemento DOM
            disabled={disabled || loading} // Deshabilita si está 'disabled' O 'loading'
            {...props} // Pasa todas las demás props (como onClick)
        >
            {/* Muestra el contenido en el orden correcto */}
            {loading && <LoadingSpinner />}
            {iconName && iconPosition === 'left' && renderIcon()}
            {children}
            {iconName && iconPosition === 'right' && renderIcon()}
        </button>
    );

    // --- Lógica de 'asChild' ---
    // Esta es la parte más compleja. Si 'asChild' es true,
    // clona el 'children' y le fusiona las propiedades del botón.
    if (asChild) {
        try {
            // Valida que solo haya un hijo directo
            if (!children || React.Children?.count(children) !== 1) {
                return renderFallbackButton();
            }
            const child = React.Children?.only(children);
            if (!React.isValidElement(child)) {
                return renderFallbackButton();
            }

            // Prepara el contenido interno (spinner, íconos, y el contenido original del hijo)
            const content = (
                <>
                    {loading && <LoadingSpinner />}
                    {iconName && iconPosition === 'left' && renderIcon()}
                    {child?.props?.children}
                    {iconName && iconPosition === 'right' && renderIcon()}
                </>
            );

            // Clona al hijo y le inyecta las nuevas props
            const clonedChild = React.cloneElement(child, {
                className: cn(
                    buttonVariants({ variant, size, className }),
                    fullWidth && "w-full",
                    child?.props?.className // Importante: conserva las clases originales del hijo
                ),
                disabled: disabled || loading || child?.props?.disabled,
                children: content, // Reemplaza los hijos con nuestro contenido preparado
            });

            // Retorna el componente 'Comp' (que es 'Slot') pasando la ref y props,
            // y poniendo el hijo clonado dentro.
            return <Comp ref={ref} {...props}>{clonedChild}</Comp>;
        } catch {
            // Si cualquier parte de la clonación falla, usa el botón normal
            return renderFallbackButton();
        }
    }

    // --- Retorno por Defecto (si 'asChild' es false) ---
    // Renderiza un <button> normal.
    return (
        <Comp
            className={cn(
                buttonVariants({ variant, size, className }),
                fullWidth && "w-full"
            )}
            ref={ref}
            disabled={disabled || loading}
            {...props} // Pasa todas las demás props (como onClick, type, etc.)
        >
            {loading && <LoadingSpinner />}
            {iconName && iconPosition === 'left' && renderIcon()}
            {children}
            {iconName && iconPosition === 'right' && renderIcon()}
        </Comp>
    );
});

// Asigna un nombre de visualización para facilitar la depuración en React DevTools
Button.displayName = "Button";
// Exporta el componente para que pueda ser usado en otras partes de la app
export default Button;

