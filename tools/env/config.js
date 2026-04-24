const config = {
    dev: {        
        /* authenticationUrl: 'http://10.10.0.9:7000/auth/v1.0/backoffice/',
        reportUrl: 'http://10.10.0.9:7001/reports/v1.0/backoffice/',
        settingUrl: 'http://10.10.0.9:7002/base-settings/v1.0/backoffice/',
        fileUrl: 'http://10.10.0.9:7000/auth/backoffice/', */

        /* authenticationUrl:
            'https://api-services.mazone.imako.digital/auth/v1.0/backoffice/',
        reportUrl:
            'https://api-services.mazone.imako.digital/reports/v1.0/backoffice/',
        settingUrl:
            'https://api-services.mazone.imako.digital/base-settings/v1.0/backoffice/',
        fileUrl: 'https://api-services.mazone.imako.digital/auth/backoffice/', */

        authenticationUrl: 'https://cmz-service-api.paas.imako.digital/auth/v1.0/backoffice/',
        reportUrl: 'https://cmz-service-api.paas.imako.digital/reports/v1.0/backoffice/',
        settingUrl: 'https://cmz-service-api.paas.imako.digital/base-settings/v1.0/backoffice/',
        userUrl: 'https://cmz-service-api.paas.imako.digital/users/v1.0/backoffice/',
        fileUrl: 'https://cmz-service-api.paas.imako.digital/auth/backoffice/',
        environmentDeployment: 'DEV',
        enableDebug: true,

        appSettings: {
            appName: 'Connect My Zone',
            appLogoFull: 'assets/images/logo/logo-ansut-full.png',
            appLogoIcon: 'assets/images/favicon.png',
            appPrimaryColor: '#2256A3',
            appSecondaryColor: '#F08224',
            appTertiaryColor: '#FFFFFF',
        },
    },
    cloud: {
        authenticationUrl: 'https://cmz-service-api.paas.imako.digital/auth/v1.0/backoffice/',
        reportUrl: 'https://cmz-service-api.paas.imako.digital/reports/v1.0/backoffice/',
        settingUrl: 'https://cmz-service-api.paas.imako.digital/base-settings/v1.0/backoffice/',
        fileUrl: 'https://cmz-service-api.paas.imako.digital/auth/backoffice/',
        environmentDeployment: 'DEV',
        enableDebug: true,
        messageApp: {
            sourceStockTenantSim: 'Le système utilisera une SIM blanche du Stock du Tenant',
            sourceStockOrangeSim: 'Orange fournira la SIM...',
            sourceSoldeDotation: 'Le solde de la dotation Data...',
            sourceSoldeDotationOrange: 'Orange fera le dépôt...',
        },

        appSettings: {
            appName: 'Connect My Zone',
            appLogoFull: 'assets/images/logo/logo-ansut-full.png',
            appLogoIcon: 'assets/images/favicon.png',
            appPrimaryColor: '#2256A3',
            appSecondaryColor: '#F08224',
            appTertiaryColor: '#FFFFFF',
        },
    },
    cmz_dev: {
        authenticationUrl: 'https://api-services.mazone-test.ansut.ci/auth/v1.0/backoffice/',
        reportUrl: 'https://api-services.mazone-test.ansut.ci/reports/v1.0/backoffice/',
        settingUrl: 'https://api-services.mazone-test.ansut.ci/base-settings/v1.0/backoffice/',
        fileUrl: 'https://api-services.mazone-test.ansut.ci/auth/backoffice/',
        environmentDeployment: 'DEV',
        enableDebug: true,
        messageApp: {
            sourceStockTenantSim: 'Le système utilisera une SIM blanche du Stock du Tenant',
            sourceStockOrangeSim: 'Orange fournira la SIM...',
            sourceSoldeDotation: 'Le solde de la dotation Data...',
            sourceSoldeDotationOrange: 'Orange fera le dépôt...',
        },

        appSettings: {
            appName: 'Connect My Zone',
            appLogoFull: 'assets/images/logo/logo-ansut-full.png',
            appLogoIcon: 'assets/images/favicon.png',
            appPrimaryColor: '#2256A3',
            appSecondaryColor: '#F08224',
            appTertiaryColor: '#FFFFFF',
        },
    },
    cmz_prod: {
        authenticationUrl: 'https://api-services.connecte-ma-zone.ansut.ci/auth/v1.0/backoffice/',
        reportUrl: 'https://api-services.connecte-ma-zone.ansut.ci/reports/v1.0/backoffice/',
        settingUrl: 'https://api-services.connecte-ma-zone.ansut.ci/base-settings/v1.0/backoffice/',
        fileUrl: 'https://api-services.connecte-ma-zone.ansut.ci/auth/backoffice/',
        environmentDeployment: 'CMZ_PROD',
        enableDebug: true,
        messageApp: {
            sourceStockTenantSim: 'Le système utilisera une SIM blanche du Stock du Tenant',
            sourceStockOrangeSim: 'Orange fournira la SIM...',
            sourceSoldeDotation: 'Le solde de la dotation Data...',
            sourceSoldeDotationOrange: 'Orange fera le dépôt...',
        },

        appSettings: {
            appName: 'Connect My Zone',
            appLogoFull: 'assets/images/logo/logo-ansut-full.png',
            appLogoIcon: 'assets/images/favicon.png',
            appPrimaryColor: '#2256A3',
            appSecondaryColor: '#F08224',
            appTertiaryColor: '#FFFFFF',
        },
    }
};

export default config;
