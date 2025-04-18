(function (window) {
    window.__env = {
        verifyIdentityDocumentUrl: "__VERIFY_IDENTITY_URL__",
        apiUrl: "__API_URL__",
        fileUrl: "__FILE_URL__",
        environmentDeployment: "__ENVIRONMENT__",
        enableDebug: __ENABLE_DEBUG__,
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
