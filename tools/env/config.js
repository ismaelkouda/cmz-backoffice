module.exports = {
    dev: {
        verifyIdentityDocumentUrl: 'https://sim-monitoring.cateli.io:8013/',
        // apiUrl: "http://10.10.70.64:8001/api/v1/",
        // fileUrl: "http://10.10.70.64:8001/",
                apiUrl: 'https://sim-monitoring.cateli.io:12555/api/v1/',
        fileUrl: 'https://sim-monitoring.cateli.io:12555/',
        environmentDeployment: 'DEV',
        enableDebug: true,
        headerSettings: {
            appTypePS: 'PATRIMOINE SIM',
            appTypeSM: 'SIM MONITORING',
        },
        messageApp: {
            sourceStockTenantSim:
                'Le système utilisera une SIM blanche du Stock du Tenant',
            sourceStockOrangeSim: 'Orange fournira la SIM...',
            sourceSoldeDotation: 'Le solde de la dotation Data...',
            sourceSoldeDotationOrange: 'Orange fera le dépôt...',
        },
    },
    test: {
        verifyIdentityDocumentUrl: 'https://sim-monitoring.cateli.io:8013/',
        // apiUrl: "http://10.10.70.64:8001/api/v1/",
        // fileUrl: "http://10.10.70.64:8001/",
        apiUrl: 'http://10.10.0.200:12555/api/v1/',
        fileUrl: 'http://10.10.0.200:12555/',
        environmentDeployment: 'TEST',
        enableDebug: true,
        headerSettings: {
            appTypePS: 'PATRIMOINE SIM',
            appTypeSM: 'SIM MONITORING',
        },
        messageApp: {
            sourceStockTenantSim:
                'Le système utilisera une SIM blanche du Stock du Tenant',
            sourceStockOrangeSim: 'Orange fournira la SIM...',
            sourceSoldeDotation: 'Le solde de la dotation Data...',
            sourceSoldeDotationOrange: 'Orange fera le dépôt...',
        },
    },
    prod: {
        verifyIdentityDocumentUrl: 'https://sim-monitoring.cateli.io:8013/',
        apiUrl: 'https://sim-monitoring.cateli.io:12555/api/v1/',
        fileUrl: 'https://sim-monitoring.cateli.io:12555/',
        environmentDeployment: 'PROD',
        enableDebug: false,
        headerSettings: {
            appTypePS: 'PATRIMOINE SIM',
            appTypeSM: 'SIM MONITORING',
        },
        messageApp: {
            sourceStockTenantSim:
                'Le système utilisera une SIM blanche du Stock du Tenant',
            sourceStockOrangeSim: 'Orange fournira la SIM...',
            sourceSoldeDotation: 'Le solde de la dotation Data...',
            sourceSoldeDotationOrange: 'Orange fera le dépôt...',
        },
    },
};
