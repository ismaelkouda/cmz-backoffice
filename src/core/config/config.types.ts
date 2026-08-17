// ⚠️ GENERATED FILE - DO NOT EDIT MANUALLY

export interface AppConfig {
    authenticationUrl: string;
    reportUrl: string;
    settingUrl: string;
    fileUrl: string;
    environmentDeployment: 'DEV' | 'CLOUD' | 'CMZ_DEV' | 'CMZ_PROD' | 'PROD';
    enableDebug: boolean;

    appSettings: {
        app: {
        name: string;
        title: string;
        description: string;
        keywords: string;
        author: string;
    };

    fonts: {
        primary: string;
        secondary: string;
    };

    colors: {
        primary: string;
        secondary: string;
        tertiary: string;
        black: string;
        white: string;
        gray: string;
        grayLight: string;
        error: string;
        warning: string;
        success: string;
        info: string;
    };

    languages: {
        supported: readonly string[];
        default: string;
        storageKey: string;
    };

    modes: {
        supported: readonly string[];
        default: string;
        storageKey: string;
    };

    assets: {
        favicon: string;
        authLogo: string;
        sidebarLogo: string;
        logoIcon: string;
        loginBg: string;
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
    };
}

export interface BuildInfo {
    environment: string;
    version: string;
    commitHash: string;
}

declare global {
    interface Window {
        __env: AppConfig & { buildInfo: BuildInfo };
    }
}

