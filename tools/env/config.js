module.exports = {
    dev: {
        verifyIdentityDocumentUrl: 'https://sim-monitoring.cateli.io:8013/',
        apiUrl: 'http://10.10.70.64:7000/auth/v1.0/',
        fileUrl: 'http://10.10.70.64:7000/auth/',
        //        apiUrl: 'https://services-care-portal-service-api.paas.imako.digital/api/v1/',
        //      fileUrl: 'https://services-care-portal-service-api.paas.imako.digital/',
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
            appLogoFull: 'assets/images/logo/logo-ansut-full.png',
            appLogoIcon: 'assets/images/favicon.png',
            appPrimaryColor: '#0566FF',
            appSecondaryColor: '#F08224',
            appTertiaryColor: '#FFFFFF',
        },
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
