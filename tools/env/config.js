const config = {
    dev: {
        verifyIdentityDocumentUrl: 'https://sim-monitoring.cateli.io:8013/',
        authenticationUrl: 'http://10.10.0.9:7000/auth/v1.0/backoffice/',
        reportUrl: 'http://10.10.0.9:7001/reports/v1.0/backoffice/',
        settingUrl: 'http://10.10.0.9:7002/base-settings/v1.0/backoffice/',
        fileUrl: 'http://10.10.0.9:7000/auth/backoffice/',
        /*         authenticationUrl:
            'https://api-services.mazone.imako.digital/auth/v1.0/backoffice/',
        reportUrl:
            'https://api-services.mazone.imako.digital/reports/v1.0/backoffice/',
        settingUrl:
            'https://api-services.mazone.imako.digital/base-settings/v1.0/backoffice/',
        fileUrl: 'https://api-services.mazone.imako.digital/auth/backoffice/', */
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
            appLogoFull: 'assets/images/logo/logo-ansut-full.png',
            appLogoIcon: 'assets/images/favicon.png',
            appPrimaryColor: '#0566FF',
            appSecondaryColor: '#F08224',
            appTertiaryColor: '#FFFFFF',
        },
    },
    test: {
        verifyIdentityDocumentUrl: 'https://sim-monitoring.cateli.io:8013/',
        authenticationUrl: 'http://10.10.70.64:7000/auth/v1.0/backoffice/',
        reportUrl: 'http://10.10.70.64:7001/reports/v1.0/backoffice/',
        settingUrl: 'http://10.10.70.64:7002/base-settings/v1.0/backoffice/',
        fileUrl: 'http://10.10.0.200:12555/',
        environmentDeployment: 'TEST',
        enableDebug: true,
    },
    prod: {
        verifyIdentityDocumentUrl: 'https://sim-monitoring.cateli.io:8013/',
        authenticationUrl: 'http://10.10.70.64:7000/auth/v1.0/backoffice/',
        reportUrl: 'http://10.10.70.64:7001/reports/v1.0/backoffice/',
        settingUrl: 'http://10.10.70.64:7002/base-settings/v1.0/backoffice/',
        fileUrl: 'https://sim-monitoring.cateli.io:12555/',
        environmentDeployment: 'PROD',
        enableDebug: false,
    },
};

export default config;
