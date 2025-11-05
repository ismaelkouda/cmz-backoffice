const Joi = require('joi');

const configSchema = Joi.object({
    verifyIdentityDocumentUrl: Joi.string().uri().required(),
    apiUrl: Joi.string().uri().required(),
    fileUrl: Joi.string().uri().required(),
    environmentDeployment: Joi.string().valid('DEV', 'TEST', 'PROD').required(),
    enableDebug: Joi.boolean().required(),
    messageApp: Joi.object({
        sourceStockTenantSim: Joi.string().required(),
        sourceStockOrangeSim: Joi.string().required(),
        sourceSoldeDotation: Joi.string().required(),
        sourceSoldeDotationOrange: Joi.string().required(),
    }).optional(),
    appSettings: Joi.object({
        appName: Joi.string().required(),
        appLogoFull: Joi.string().required(),
        appLogoIcon: Joi.string().required(),
        appPrimaryColor: Joi.string()
            .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
            .required(),
        appSecondaryColor: Joi.string()
            .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
            .required(),
        appTertiaryColor: Joi.string()
            .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
            .required(),
    }).optional(),
}).options({ stripUnknown: true });

function validateConfig(config) {
    const { error, value } = configSchema.validate(config, {
        abortEarly: false,
        convert: false,
    });

    return {
        isValid: !error,
        config: value,
        errors: error ? error.details.map((detail) => detail.message) : [],
    };
}

function generateTypes(config) {
    return `// ⚠️ GENERATED FILE - DO NOT EDIT MANUALLY
            // Generated at: ${new Date().toISOString()}

export interface AppConfig {
    verifyIdentityDocumentUrl: string;
    apiUrl: string;
    fileUrl: string;
    environmentDeployment: 'DEV' | 'TEST' | 'PROD';
    enableDebug: boolean;
    messageApp?: {
        sourceStockTenantSim: string;
        sourceStockOrangeSim: string;
        sourceSoldeDotation: string;
        sourceSoldeDotationOrange: string;
    };
    appSettings?: {
        appName: string;
        appLogoFull: string;
        appLogoIcon: string;
        appPrimaryColor: string;
        appSecondaryColor: string;
        appTertiaryColor: string;
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

// Environment-specific configurations
export const ENVIRONMENTS = ${JSON.stringify(config, null, 2)} as const;

export type EnvironmentName = keyof typeof ENVIRONMENTS;
`;
}

module.exports = {
    validateConfig,
    generateTypes,
};
