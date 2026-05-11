import { AppConfig } from '@core/config/config.types';
import { DEFAULT_CUSTOMIZATION } from '@shared/domain/services/app-customization/app-customization.config';
import { AppCustomizationConfig } from '@shared/domain/services/app-customization/app-customization.interface';

export function createAppCustomization(
    config: AppConfig
): AppCustomizationConfig {
    const appSettings = config.appSettings;

    return {
        app: {
            name: appSettings.app.name ?? DEFAULT_CUSTOMIZATION.app.name,
            title: appSettings.app.title ?? DEFAULT_CUSTOMIZATION.app.title,
            description:
                appSettings.app.description ??
                DEFAULT_CUSTOMIZATION.app.description,
            keywords:
                appSettings.app.keywords ?? DEFAULT_CUSTOMIZATION.app.keywords,
            author: appSettings.app.author ?? DEFAULT_CUSTOMIZATION.app.author,
        },

        fonts: {
            primary:
                appSettings.fonts.primary ??
                DEFAULT_CUSTOMIZATION.fonts.primary,
            secondary:
                appSettings.fonts.secondary ??
                DEFAULT_CUSTOMIZATION.fonts.secondary,
        },

        colors: {
            primary:
                appSettings.colors.primary ??
                DEFAULT_CUSTOMIZATION.colors.primary,
            secondary:
                appSettings.colors.secondary ??
                DEFAULT_CUSTOMIZATION.colors.secondary,
            tertiary:
                appSettings.colors.tertiary ??
                DEFAULT_CUSTOMIZATION.colors.tertiary,
            black:
                appSettings.colors.black ?? DEFAULT_CUSTOMIZATION.colors.black,
            white:
                appSettings.colors.white ?? DEFAULT_CUSTOMIZATION.colors.white,
            gray: appSettings.colors.gray ?? DEFAULT_CUSTOMIZATION.colors.gray,
            grayLight:
                appSettings.colors.grayLight ??
                DEFAULT_CUSTOMIZATION.colors.grayLight,
            error:
                appSettings.colors.error ?? DEFAULT_CUSTOMIZATION.colors.error,
            warning:
                appSettings.colors.warning ??
                DEFAULT_CUSTOMIZATION.colors.warning,
            success:
                appSettings.colors.success ??
                DEFAULT_CUSTOMIZATION.colors.success,
            info: appSettings.colors.info ?? DEFAULT_CUSTOMIZATION.colors.info,
        },

        languages: {
            supported:
                appSettings.languages.supported ??
                DEFAULT_CUSTOMIZATION.languages.supported,
            default:
                appSettings.languages.default ??
                DEFAULT_CUSTOMIZATION.languages.default,
            storageKey: DEFAULT_CUSTOMIZATION.languages.storageKey,
        },

        modes: {
            supported:
                appSettings.modes.supported ??
                DEFAULT_CUSTOMIZATION.modes.supported,
            default:
                appSettings.modes.default ??
                DEFAULT_CUSTOMIZATION.modes.default,
            storageKey: DEFAULT_CUSTOMIZATION.modes.storageKey,
        },

        assets: {
            favicon:
                appSettings.assets.favicon ??
                DEFAULT_CUSTOMIZATION.assets.favicon,
            authLogo:
                appSettings.assets.authLogo ??
                DEFAULT_CUSTOMIZATION.assets.authLogo,
            sidebarLogo:
                appSettings.assets.sidebarLogo ??
                DEFAULT_CUSTOMIZATION.assets.sidebarLogo,
            logoIcon:
                appSettings.assets.logoIcon ??
                DEFAULT_CUSTOMIZATION.assets.logoIcon,
            loginBg:
                appSettings.assets.loginBg ??
                DEFAULT_CUSTOMIZATION.assets.loginBg,
        },

        loadingBar: {
            color:
                appSettings.loadingBar.color ??
                DEFAULT_CUSTOMIZATION.loadingBar.color,
            height:
                appSettings.loadingBar.height ??
                DEFAULT_CUSTOMIZATION.loadingBar.height,
            includeSpinner:
                appSettings.loadingBar.includeSpinner ??
                DEFAULT_CUSTOMIZATION.loadingBar.includeSpinner,
        },

        error: {
            ...DEFAULT_CUSTOMIZATION.error,
            displayStyles: {
                ...DEFAULT_CUSTOMIZATION.error.displayStyles,
                background:
                    appSettings.error.displayStyles.background ??
                    DEFAULT_CUSTOMIZATION.error.displayStyles.background,
            },
        },

        performance: DEFAULT_CUSTOMIZATION.performance,
    };
}
