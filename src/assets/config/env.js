(function (window) {
    window.__env = window.__env || {};

    // PROD Config
    window.__env.prod = {
        verifyIdentityDocumentUrl: 'https://osim-monitoring.orange.ci:8013/',
        apiUrl: 'https://gs2e-osim.orange.ci:12300/api/v1/',
        fileUrl: 'https://gs2e-osim.orange.ci:12300/',
        environmentDeployment: 'PROD',
        enableDebug: false
    };
 
    // DEV Config
    window.__env.dev = {
        // verifyIdentityDocumentUrl: 'http://10.10.0.200:48013/',
        // verifyIdentityDocumentUrl: "http://10.10.0.53:5000/",
        // verifyIdentityDocumentUrl: 'https://osim-monitoring.orange.ci:8013/',
        verifyIdentityDocumentUrl: "https://sim-monitoring.cateli.io:8013/",
        // apiUrl: 'http://10.10.0.200:12555/api/v1/',
        // fileUrl: 'http://10.10.0.200:12555/',
        // apiUrl: "http://10.10.0.30:8002/api/v1/",
        // fileUrl: "http://10.10.0.30:8002/", 
        // Adresse Backend SIM MONITORING
        // apiUrl: "https://sim-monitoring.cateli.io:12555/api/v1/",
        // fileUrl: "https://sim-monitoring.cateli.io:12555/",
        // Adresse Backend PATRIMOINE SIM
        // apiUrl: "https://sim-monitoring.cateli.io:12999/api/v1/",
        // fileUrl: "https://sim-monitoring.cateli.io:12999/",
        apiUrl: "http://10.10.70.64:8001/api/v1/",
        fileUrl: "http://10.10.70.64:8001/", 
        // apiUrl: "https://osim-monitoring.orange.ci:12200/api/v1/",
        // fileUrl: "https://osim-monitoring.orange.ci:12200/",
        //apiUrl:"https://gs2e-osim.orange.ci:12300/api/v1/",
        //fileUrl:"https://gs2e-osim.orange.ci:12300/",

        //  apiUrl: "https://osim-monitoring.orange.ci:12400/api/v1/",
        //  fileUrl: "https://osim-monitoring.orange.ci:12400/", 
        environmentDeployment: 'DEV',
        enableDebug: true
    };

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

    window.__env.currentEnv = window.__env.dev;

}(this));
