import { AppCustomizationConfig } from './app-customization.interface';

/**
 * Valeurs par défaut de personnalisation de l'application
 */
export const DEFAULT_CUSTOMIZATION: AppCustomizationConfig = {
    app: {
        name: 'Connect My Zone',
        title: 'Connect My Zone Back-office',
        description: 'Système de Gestion des zones non connectées',
        keywords: 'Connect My Zone, Back-office, Gestion, Zones non connectées',
        author: 'Connect My Zone',
        lang: 'fr',
    },
    colors: {
        primary: '#5B9BD5',
        secondary: '#f73164',
        tertiary: '#FFFFFF',
        error: '#dc3545',
        warning: '#ffc107',
        success: '#28a745',
        info: '#17a2b8',
        loadingBar: '#5B9BD5',
    },
    languages: {
        supported: ['en', 'fr'] as const,
        default: 'fr',
        storageKey: 'language',
    },
    layout: {
        type: 'ltr',
        version: 'light-only',
        sidebarType: 'default-sidebar',
        icon: 'stroke-svg',
    },
    assets: {
        favicon: 'favicon.ico',
        logoFull: 'assets/images/logo/logo-ansut-full.png',
        logoIcon: 'assets/images/favicon.png',
    },
    loadingBar: {
        color: '#5B9BD5',
        height: '4px',
        includeSpinner: false,
    },
    error: {
        displayStyles: {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            background: '#dc3545',
            color: 'white',
            padding: '1rem',
            textAlign: 'center',
            fontFamily: 'Arial, sans-serif',
            zIndex: '9999',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        },
        role: 'alert',
        ariaLive: 'assertive',
    },
    performance: {
        bootstrapStartMark: 'app-bootstrap-start',
        bootstrapEndMark: 'app-bootstrap-end',
        bootstrapMeasure: 'app-bootstrap',
    },
};
