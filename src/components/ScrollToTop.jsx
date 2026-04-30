import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Componente utilitario que hace scroll hacia la parte superior de la página
 * cada vez que cambia la ruta (pathname).
 * Ideal para ser colocado a nivel raíz del router.
 * 
 * @returns {null} No renderiza nada en el DOM.
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

export default ScrollToTop;