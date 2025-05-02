
(function (window) {
    window.__env = {
    "verifyIdentityDocumentUrl": "https://sim-monitoring.cateli.io:8013/",
    "apiUrl": "http://10.10.70.64:8001/api/v1/",
    "fileUrl": "http://10.10.70.64:8001/",
    "environmentDeployment": "DEV",
    "enableDebug": true,
    "headerSettings": {
        "appTypePS": "PATRIMOINE SIM",
        "appTypeSM": "SIM MONITORING"
    },
    "messageApp": {
        "sourceStockTenantSim": "Le système utilisera une SIM blanche du Stock du Tenant",
        "sourceStockOrangeSim": "Orange fournira la SIM...",
        "sourceSoldeDotation": "Le solde de la dotation Data...",
        "sourceSoldeDotationOrange": "Orange fera le dépôt..."
    }
};
window.__env = window.__env.prod; 
})(this);
