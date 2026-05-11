// ⚠️ GENERATED FILE - DO NOT EDIT MANUALLY
// Generated at: 2026-05-11T14:05:42.657Z

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

export const ENVIRONMENTS = {
    dev: {
        authenticationUrl:
            'https://cmz-service-api.paas.imako.digital/auth/v1.0/backoffice/',
        reportUrl:
            'https://cmz-service-api.paas.imako.digital/reports/v1.0/backoffice/',
        settingUrl:
            'https://cmz-service-api.paas.imako.digital/base-settings/v1.0/backoffice/',
        userUrl:
            'https://cmz-service-api.paas.imako.digital/users/v1.0/backoffice/',
        fileUrl: 'https://cmz-service-api.paas.imako.digital/auth/backoffice/',
        environmentDeployment: 'DEV',
        enableDebug: true,
        appSettings: {
            app: {
                name: 'Connect My Zone',
                title: 'Connect My Zone Back-office',
                description: 'Système de Gestion des zones non connectées',
                keywords:
                    'Connect My Zone, Back-office, Gestion, Zones non connectées',
                author: 'ANSUT',
            },
            fonts: {
                primary: "'Avenir', 'Futura', sans-serif",
                secondary: "'Helvetica', sans-serif",
            },
            colors: {
                primary: '#2256a3',
                secondary: '#f08224',
                tertiary: '#FFFFFF',
                black: '#1D1D1B',
                white: '#ffffff',
                gray: '#878787',
                grayLight: '#e0e0de',
                error: '#dc3545',
                warning: '#ffc107',
                success: '#28a745',
                info: '#17a2b8',
            },
            languages: {
                supported: ['en', 'fr'],
                default: 'fr',
                storageKey: 'language',
            },
            modes: {
                supported: ['dark', 'light', 'system'],
                default: 'light',
                storageKey: 'mode',
            },
            assets: {
                favicon: 'favicon.ico',
                authLogo: 'assets/images/logo/app-logo-full.png',
                sidebarLogo: 'https://ansut.ci/data/2023/07/logofooter.svg',
                logoIcon: 'assets/images/favicon.png',
                loginBg: 'assets/images/login/login_bg.jpg',
            },
            loadingBar: {
                color: '#2256a3',
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
        },
    },
    cloud: {
        authenticationUrl:
            'https://cmz-service-api.paas.imako.digital/auth/v1.0/backoffice/',
        reportUrl:
            'https://cmz-service-api.paas.imako.digital/reports/v1.0/backoffice/',
        settingUrl:
            'https://cmz-service-api.paas.imako.digital/base-settings/v1.0/backoffice/',
        fileUrl: 'https://cmz-service-api.paas.imako.digital/auth/backoffice/',
        environmentDeployment: 'DEV',
        enableDebug: true,
        messageApp: {
            sourceStockTenantSim:
                'Le système utilisera une SIM blanche du Stock du Tenant',
            sourceStockOrangeSim: 'Orange fournira la SIM...',
            sourceSoldeDotation: 'Le solde de la dotation Data...',
            sourceSoldeDotationOrange: 'Orange fera le dépôt...',
        },
        appSettings: {
            appName: 'Connect My Zone',
            authLogo: 'assets/images/logo/app-logo-full.png',
            appLogoIcon: 'assets/images/favicon.png',
            appPrimaryColor: '#2256A3',
            appSecondaryColor: '#F08224',
            appTertiaryColor: '#FFFFFF',
        },
    },
    cmz_dev: {
        authenticationUrl:
            'https://api-services.mazone-test.ansut.ci/auth/v1.0/backoffice/',
        reportUrl:
            'https://api-services.mazone-test.ansut.ci/reports/v1.0/backoffice/',
        settingUrl:
            'https://api-services.mazone-test.ansut.ci/base-settings/v1.0/backoffice/',
        fileUrl: 'https://api-services.mazone-test.ansut.ci/auth/backoffice/',
        environmentDeployment: 'DEV',
        enableDebug: true,
        appSettings: {
            app: {
                name: 'Connect My Zone',
                title: 'Connect My Zone Back-office',
                description: 'Système de Gestion des zones non connectées',
                keywords:
                    'Connect My Zone, Back-office, Gestion, Zones non connectées',
                author: 'ANSUT',
            },
            fonts: {
                primary: "'Avenir', 'Futura', sans-serif",
                secondary: "'Helvetica', sans-serif",
            },
            colors: {
                primary: '#2256a3',
                secondary: '#f08224',
                tertiary: '#FFFFFF',
                black: '#1D1D1B',
                white: '#ffffff',
                gray: '#878787',
                grayLight: '#e0e0de',
                error: '#dc3545',
                warning: '#ffc107',
                success: '#28a745',
                info: '#17a2b8',
            },
            languages: {
                supported: ['en', 'fr'],
                default: 'fr',
                storageKey: 'language',
            },
            modes: {
                supported: ['dark', 'light', 'system'],
                default: 'light',
                storageKey: 'mode',
            },
            assets: {
                favicon: 'favicon.ico',
                authLogo: 'assets/images/logo/app-logo-full.png',
                sidebarLogo: 'https://ansut.ci/data/2023/07/logofooter.svg',
                logoIcon: 'assets/images/favicon.png',
                loginBg: 'assets/images/login/login_bg.jpg',
            },
            loadingBar: {
                color: '#2256a3',
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
        },
    },
    cmz_prod: {
        authenticationUrl:
            'https://api-services.connecte-ma-zone.ansut.ci/auth/v1.0/backoffice/',
        reportUrl:
            'https://api-services.connecte-ma-zone.ansut.ci/reports/v1.0/backoffice/',
        settingUrl:
            'https://api-services.connecte-ma-zone.ansut.ci/base-settings/v1.0/backoffice/',
        fileUrl:
            'https://api-services.connecte-ma-zone.ansut.ci/auth/backoffice/',
        environmentDeployment: 'CMZ_PROD',
        enableDebug: true,
        appSettings: {
            app: {
                name: 'Connect My Zone',
                title: 'Connect My Zone Back-office',
                description: 'Système de Gestion des zones non connectées',
                keywords:
                    'Connect My Zone, Back-office, Gestion, Zones non connectées',
                author: 'ANSUT',
            },
            fonts: {
                primary: "'Avenir', 'Futura', sans-serif",
                secondary: "'Helvetica', sans-serif",
            },
            colors: {
                primary: '#2256a3',
                secondary: '#f08224',
                tertiary: '#FFFFFF',
                black: '#1D1D1B',
                white: '#ffffff',
                gray: '#878787',
                grayLight: '#e0e0de',
                error: '#dc3545',
                warning: '#ffc107',
                success: '#28a745',
                info: '#17a2b8',
            },
            languages: {
                supported: ['en', 'fr'],
                default: 'fr',
                storageKey: 'language',
            },
            modes: {
                supported: ['dark', 'light', 'system'],
                default: 'light',
                storageKey: 'mode',
            },
            assets: {
                favicon: 'favicon.ico',
                authLogo: 'assets/images/logo/app-logo-full.png',
                sidebarLogo: 'https://ansut.ci/data/2023/07/logofooter.svg',
                logoIcon: 'assets/images/favicon.png',
                loginBg: 'assets/images/login/login_bg.jpg',
            },
            loadingBar: {
                color: '#2256a3',
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
        },
    },
} as const;
export type EnvironmentName = keyof typeof ENVIRONMENTS;
