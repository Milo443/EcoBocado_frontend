/**
 * Configuración centralizada para PrimeReact.
 * 
 * Esta configuración facilita la migración a PrimeReact v11 al 
 * centralizar los ajustes globales y preparar el camino para 
 * el nuevo sistema de design tokens.
 */

export const primeReactConfig = {
    ripple: true,           // Efecto de ondas en botones y elementos interactivos
    inputStyle: 'filled',   // Estilo de inputs por defecto ('filled' o 'outlined')
    zIndex: {
        modal: 1100,
        overlay: 1000,
        menu: 1000,
        tooltip: 1100
    },
    // En v11, aquí se integrará el nuevo sistema de theming (Styled)
    // unstyled: false, 
};

export default primeReactConfig;
