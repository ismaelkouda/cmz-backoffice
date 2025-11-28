(function (window) {
            window.__env = {
    "verifyIdentityDocumentUrl": "https://sim-monitoring.cateli.io:8013/",
    "authenticationUrl": "http://10.10.0.9:7000/auth/v1.0/backoffice/",
    "reportUrl": "http://10.10.0.9:7001/reports/v1.0/backoffice/",
    "settingUrl": "http://10.10.0.9:7002/base-settings/v1.0/backoffice/",
    "fileUrl": "http://10.10.0.9:7000/auth/backoffice/",
    "environmentDeployment": "DEV",
    "enableDebug": true,
    "messageApp": {
        "sourceStockTenantSim": "Le système utilisera une SIM blanche du Stock du Tenant",
        "sourceStockOrangeSim": "Orange fournira la SIM...",
        "sourceSoldeDotation": "Le solde de la dotation Data...",
        "sourceSoldeDotationOrange": "Orange fera le dépôt..."
    },
    "appSettings": {
        "appName": "Connect My Zone",
        "appLogoFull": "assets/images/logo/logo-ansut-full.png",
        "appLogoIcon": "assets/images/favicon.png",
        "appPrimaryColor": "#0566FF",
        "appSecondaryColor": "#F08224",
        "appTertiaryColor": "#FFFFFF"
    }
};
            window.__env.buildInfo = {
                timestamp: '2025-11-28T18:28:16.405Z',
                environment: 'dev',
                version: '1.1.0',
                commitHash: 'local'
            };
            
            // Validation de la configuration
            if (typeof window.__env.authenticationUrl === 'undefined' && typeof window.__env.reportUrl === 'undefined' && typeof window.__env.settingUrl === 'undefined') {
                console.error('❌ Configuration API manquante');
            }
            
            // Lock la configuration
            Object.freeze(window.__env);
            Object.freeze(window.__env.messageApp);
            Object.freeze(window.__env.appSettings);
        })(this);