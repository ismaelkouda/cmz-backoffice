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


(function (window) {
  window.__env = {
      verifyIdentityDocumentUrl: "https://sim-monitoring.cateli.io:8013/",
      apiUrl: "http://10.10.0.200:12555/api/v1/",
      fileUrl: "http://10.10.0.200:12555/", 
      environmentDeployment: "DEV",
      enableDebug: true,
      headerSettings: {
          appTypePS: 'PATRIMOINE SIM',
          appTypeSM: 'SIM MONITORING'
      },
      messageApp: {
          sourceStockTenantSim: 'Le système utilisera une SIM blanche du Stock du Tenant',
          sourceStockOrangeSim: 'Orange fournira la SIM. A l\'issue de l\'operation, elle sera livrée au point de contact accompagnée d\'une facture',
          sourceSoldeDotation: 'Le solde de la dotation Data sera debité du volume demandé',
          sourceSoldeDotationOrange: 'Orange fera le dépôt du volume demandé sur le compte Data de la SIM. A l\'issue de l\'operation une facture sera générée'
      }
  };
  window.__env.currentEnv = window.__env;
})(this);