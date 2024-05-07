(function (window) {
    window.__env = window.__env || {};

    window.__env.apiUrl = 'http://10.10.0.200:12500/api/v1/';
    window.__env.fileUrl = 'http://10.10.0.200:12500/';
    window.__env.headerSettings = {
        appTypePS: 'PATRIMOINE SIM',
        appTypeSM: 'SIM MONITORING'
    };
    window.__env.messageApp = {
        sourceStockTenantSim: 'Le système utilisera une SIM blanche du Stock du Tenant',
        sourceStockOrangeSim: 'Orange fournira la SIM. A l\'issue de l\'operation, elle sera livrée au point de contact accompagnée d\'une facture',
        sourceSoldeDotation: 'Le solde de la dotation Data sera debité du volume demandé',
        sourceSoldeDotationOrange: 'Orange fera le dépôt du volume demandé sur le compte Data de la SIM. A l\'issue de l\'operation une facture sera générée'
    };
    window.__env.environmentDeployment = 'PROD'
    window.__env.enableDebug = true;
}(this));
