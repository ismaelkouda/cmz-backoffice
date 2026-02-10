import { BuildInfo } from '@environments/config.types';

export const environment = {
    production: false,
    NODE_ENV: 'dev' as const,
    authenticationUrl: 'http://10.10.70.64:7000/auth/v1.0/backoffice/',
    reportUrl: 'http://10.10.70.64:7001/reports/v1.0/backoffice/',
    settingUrl: 'http://10.10.70.64:7002/base-settings/v1.0/backoffice/',
    fileUrl: 'http://10.10.70.64:7000/auth/backoffice/',
    environmentDeployment: 'DEV' as const,
    enableDebug: true,
    messageApp: {
        sourceStockTenantSim:
            'Le système utilisera une SIM blanche du Stock du Tenant',
        sourceStockOrangeSim: 'Orange fournira la SIM...',
        sourceSoldeDotation: 'Le solde de la dotation Data...',
        sourceSoldeDotationOrange: 'Orange fera le dépôt...',
    },
    appSettings: {
        appName: 'IMAKO',
        appLogoFull: 'assets/images/logo/logo-ansut-full.png',
        appLogoIcon: 'assets/images/favicon.png',
        appPrimaryColor: '#0566FF',
        appSecondaryColor: '#F08224',
        appTertiaryColor: '#FFFFFF',
    },
    buildInfo: {
        timestamp: new Date().toISOString(),
        environment: 'DEV',
        version: '1.0.0',
        commitHash: 'local',
    } as BuildInfo,
};
