import { buildConfigSchema } from '../../src/core/config/config-schema.builder.ts'
export const environmentValues = [
    'DEV',
    'CLOUD',
    'CMZ_DEV',
    'CMZ_PROD',
    'PROD',
];
const configSchema = buildConfigSchema(environmentValues);

export function validateConfig(config) {
    const { error, value } = configSchema.validate(config, {
        abortEarly: false,
        convert: false,
    });

    return {
        isValid: !error,
        config: value,
        errors: error ? error.details.map(d => d.message) : [],
    };
}

export function generateTypes(config) {
    const envUnion = environmentValues
        .map((env) => `'${env}'`)
        .join(' | ');

    return `// ⚠️ GENERATED FILE - DO NOT EDIT MANUALLY
// Generated at: ${new Date().toISOString()}

export interface AppConfig {
    authenticationUrl: string;
    reportUrl: string;
    settingUrl: string;
    fileUrl: string;
    environmentDeployment: ${envUnion};
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
    timestamp: string;
    environment: string;
    version: string;
    commitHash: string;
}

declare global {
    interface Window {
        __env: AppConfig & { buildInfo: BuildInfo };
    }
}

export const ENVIRONMENTS = ${JSON.stringify(config, null, 2)} as const;
export type EnvironmentName = keyof typeof ENVIRONMENTS;
`;
}

export default {
    validateConfig,
    generateTypes,
};
