(function (window) {
    window.__env = {
        verifyIdentityDocumentUrl: 'https://sim-monitoring.cateli.io:8013/',
        apiUrl: "https://sim-monitoring.cateli.io:12999/api/v1/",
        fileUrl: "https://sim-monitoring.cateli.io:12999/",
        environmentDeployment: "PROD",
        enableDebug: false,
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
})(this);
