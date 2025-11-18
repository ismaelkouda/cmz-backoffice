/**
 * Interface pour les paramètres de personnalisation de l'application
 */
export interface AppCustomizationConfig {
    /**
     * Configuration de l'application
     */
    app: {
        name: string;
        title: string;
        description: string;
        keywords: string;
        author: string;
        lang: string;
    };

    /**
     * Configuration des couleurs
     */
    colors: {
        primary: string;
        secondary: string;
        tertiary: string;
        error: string;
        warning: string;
        success: string;
        info: string;
        loadingBar: string;
    };

    /**
     * Configuration des langues
     */
    languages: {
        supported: readonly string[];
        default: string;
        storageKey: string;
    };

    /**
     * Configuration du layout
     */
    layout: {
        type: 'ltr' | 'rtl';
        version: string;
        sidebarType: string;
        icon: string;
    };

    /**
     * Configuration des assets
     */
    assets: {
        favicon: string;
        logoFull: string;
        logoIcon: string;
    };

    /**
     * Configuration de la loading bar
     */
    loadingBar: {
        color: string;
        height: string;
        includeSpinner: boolean;
    };

    /**
     * Configuration des messages d'erreur
     */
    error: {
        displayStyles: {
            position: string;
            top: string;
            left: string;
            width: string;
            background: string;
            color: string;
            padding: string;
            textAlign: string;
            fontFamily: string;
            zIndex: string;
            boxShadow: string;
        };
        role: string;
        ariaLive: string;
    };

    /**
     * Configuration des performances
     */
    performance: {
        bootstrapStartMark: string;
        bootstrapEndMark: string;
        bootstrapMeasure: string;
    };
}
