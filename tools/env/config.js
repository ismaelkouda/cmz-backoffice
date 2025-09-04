module.exports = {
    dev: {
        verifyIdentityDocumentUrl: 'https://sim-monitoring.cateli.io:8013/',
        // apiUrl: "http://10.10.70.64:8011/api/v1/",
        // fileUrl: "http://10.10.70.64:8011/",
        apiUrl: "https://services-care-portal-service-api.paas.imako.digital/api/v1/",
        fileUrl: "https://services-care-portal-service-api.paas.imako.digital/",
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
            appName: 'IMAKO',
            appLogoFull: '/src/assets/images/logo/logo-imako-full.png',
            appLogoIcon: '/src/assets/images/logo/logo_imako.png',
            appPrimaryColor: '#5B9BD5',
            appSecondaryColor: '#252831'
        }
    },
    test: {
        verifyIdentityDocumentUrl: 'https://sim-monitoring.cateli.io:8013/',
        apiUrl: 'http://10.10.0.200:12555/api/v1/',
        fileUrl: 'http://10.10.0.200:12555/',
        environmentDeployment: 'TEST',
        enableDebug: true,
    },
    prod: {
        verifyIdentityDocumentUrl: 'https://sim-monitoring.cateli.io:8013/',
        apiUrl: 'https://sim-monitoring.cateli.io:12555/api/v1/',
        fileUrl: 'https://sim-monitoring.cateli.io:12555/',
        environmentDeployment: 'PROD',
        enableDebug: false,
    },
};
