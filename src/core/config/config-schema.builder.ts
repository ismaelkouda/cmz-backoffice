import Joi from 'joi';

const hexColor = Joi.string().pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);

export function buildConfigSchema(environmentValues: readonly string[]) {
    return Joi.object({
        authenticationUrl: Joi.string().uri().required(),
        reportUrl: Joi.string().uri().required(),
        settingUrl: Joi.string().uri().required(),
        fileUrl: Joi.string().uri().required(),

        environmentDeployment: Joi.string()
            .valid(...environmentValues)
            .required(),

        enableDebug: Joi.boolean().required(),

        appSettings: Joi.object({
            app: Joi.object({
                name: Joi.string().required(),
                title: Joi.string().required(),
                description: Joi.string().required(),
                keywords: Joi.string().required(),
                author: Joi.string().required(),
            }).required(),

            fonts: Joi.object({
                primary: Joi.string().required(),
                secondary: Joi.string().required(),
            }).required(),

            colors: Joi.object({
                primary: hexColor.required(),
                secondary: hexColor.required(),
                tertiary: hexColor.required(),
                black: hexColor.required(),
                white: hexColor.required(),
                gray: hexColor.required(),
                grayLight: hexColor.required(),
                error: hexColor.required(),
                warning: hexColor.required(),
                success: hexColor.required(),
                info: hexColor.required(),
            }).required(),

            languages: Joi.object({
                supported: Joi.array().items(Joi.string()).min(1).required(),
                default: Joi.string().required(),
                storageKey: Joi.string().required(),
            }).required(),

            modes: Joi.object({
                supported: Joi.array()
                    .items(Joi.string().valid('dark', 'light', 'system'))
                    .required(),
                default: Joi.string()
                    .valid('dark', 'light', 'system')
                    .required(),
                storageKey: Joi.string().required(),
            }).required(),

            assets: Joi.object({
                favicon: Joi.string().required(),
                authLogo: Joi.string().required(),
                sidebarLogo: Joi.string().required(),
                logoIcon: Joi.string().required(),
                loginBg: Joi.string().required(),
            }).required(),

            loadingBar: Joi.object({
                color: hexColor.required(),
                height: Joi.string().required(),
                includeSpinner: Joi.boolean().required(),
            }).required(),

            error: Joi.object({
                displayStyles: Joi.object({
                    position: Joi.string().required(),
                    top: Joi.string().required(),
                    left: Joi.string().required(),
                    width: Joi.string().required(),
                    background: hexColor.required(),
                    color: Joi.string().required(),
                    padding: Joi.string().required(),
                    textAlign: Joi.string().required(),
                    fontFamily: Joi.string().required(),
                    zIndex: Joi.string().required(),
                    boxShadow: Joi.string().required(),
                }).required(),

                role: Joi.string().required(),
                ariaLive: Joi.string().required(),
            }).required(),

            performance: Joi.object({
                bootstrapStartMark: Joi.string().required(),
                bootstrapEndMark: Joi.string().required(),
                bootstrapMeasure: Joi.string().required(),
            }).required(),
        }).required(),
    }).options({
        stripUnknown: true,
    });
}
