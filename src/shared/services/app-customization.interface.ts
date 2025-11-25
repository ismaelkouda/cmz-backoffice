export interface AppCustomizationConfig {
    app: {
        name: string;
        title: string;
        description: string;
        keywords: string;
        author: string;
        lang: string;
    };

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

    languages: {
        supported: readonly string[];
        default: string;
        storageKey: string;
    };

    layout: {
        type: 'ltr' | 'rtl';
        version: string;
        sidebarType: string;
        icon: string;
    };

    assets: {
        favicon: string;
        logoFull: string;
        logoIcon: string;
    };

    loadingBar: {
        color: string;
        height: string;
        includeSpinner: boolean;
    };

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

    performance: {
        bootstrapStartMark: string;
        bootstrapEndMark: string;
        bootstrapMeasure: string;
    };
}
