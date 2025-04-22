module.exports = {
    dev: {
        VERIFY_IDENTITY_URL: "http://10.10.0.200:12555/",
        API_URL: "http://10.10.0.200:12555/api/v1/",
        FILE_URL: "http://10.10.0.200:12555/",
        ENVIRONMENT: "DEV",
        ENABLE_DEBUG: true,
        HEADER_SETTINGS: {
            appTypePS: 'PATRIMOINE SIM',
            appTypeSM: 'SIM MONITORING'
          },
          MESSAGE_APP: {
            sourceStockTenantSim: 'Le système utilisera une SIM blanche du Stock du Tenant',
            sourceStockOrangeSim: 'Orange fournira la SIM...',
            sourceSoldeDotation: 'Le solde de la dotation Data...',
            sourceSoldeDotationOrange: 'Orange fera le dépôt...'
          }
    },
    prod: {
        VERIFY_IDENTITY_URL: "https://osim-monitoring.orange.ci:8013/",
        API_URL: "https://sim-monitoring.cateli.io:12555/api/v1/",
        FILE_URL: "https://sim-monitoring.cateli.io:12555/",
        ENVIRONMENT: "PROD",
        ENABLE_DEBUG: false,
        HEADER_SETTINGS: {
            appTypePS: 'PATRIMOINE SIM',
            appTypeSM: 'SIM MONITORING'
          },
          MESSAGE_APP: {
            sourceStockTenantSim: 'Le système utilisera une SIM blanche du Stock du Tenant',
            sourceStockOrangeSim: 'Orange fournira la SIM...',
            sourceSoldeDotation: 'Le solde de la dotation Data...',
            sourceSoldeDotationOrange: 'Orange fera le dépôt...'
          }
    }
};
