(function (window) {
            window.__env = {
    "verifyIdentityDocumentUrl": "https://sim-monitoring.cateli.io:8013/",
    "apiUrl": "http://10.10.70.64:7000/auth/v1.0/",
    "fileUrl": "http://10.10.70.64:7000/auth/",
    "environmentDeployment": "DEV",
    "enableDebug": true,
    "messageApp": {
        "sourceStockTenantSim": "Le système utilisera une SIM blanche du Stock du Tenant",
        "sourceStockOrangeSim": "Orange fournira la SIM...",
        "sourceSoldeDotation": "Le solde de la dotation Data...",
        "sourceSoldeDotationOrange": "Orange fera le dépôt..."
    },
    "appSettings": {
        "appName": "IMAKO",
        "appLogoFull": "assets/images/logo/logo-ansut-full.png",
        "appLogoIcon": "assets/images/favicon.png",
        "appPrimaryColor": "#0566FF",
        "appSecondaryColor": "#F08224",
        "appTertiaryColor": "#FFFFFF"
    }
};
            window.__env.buildInfo = {
                timestamp: '2025-11-05T15:59:50.318Z',
                environment: 'dev',
                version: '1.1.0',
                commitHash: 'local'
            };
            
            // Validation de la configuration
            if (typeof window.__env.apiUrl === 'undefined') {
                console.error('❌ Configuration API manquante');
            }
            
            // Lock la configuration
            Object.freeze(window.__env);
            Object.freeze(window.__env.messageApp);
            Object.freeze(window.__env.appSettings);
        })(this);