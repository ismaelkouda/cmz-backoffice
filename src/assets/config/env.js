(function (window) {
            window.__env = {
    "authenticationUrl": "http://10.10.70.64:7000/auth/v1.0/backoffice/",
    "reportUrl": "http://10.10.70.64:7001/reports/v1.0/backoffice/",
    "settingUrl": "http://10.10.70.64:7002/base-settings/v1.0/backoffice/",
    "fileUrl": "https://10.10.70.64:7000/auth/backoffice/",
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
        "appPrimaryColor": "#2256A3",
        "appSecondaryColor": "#F08224",
        "appTertiaryColor": "#FFFFFF"
    }
};
            window.__env.buildInfo = {
                timestamp: '2026-03-24T12:30:05.726Z',
                environment: 'dev',
                version: '1.1.0',
                commitHash: 'local'
            };
            
            // Validation de la configuration
            if (typeof window.__env.authenticationUrl === 'undefined' && typeof window.__env.reportUrl === 'undefined' && typeof window.__env.settingUrl === 'undefined') {
                console.error('❌ Configuration API manquante (authenticationUrl, reportUrl, settingUrl)');
            }
            
            // Lock la configuration
            Object.freeze(window.__env);
            Object.freeze(window.__env.messageApp);
            Object.freeze(window.__env.appSettings);
        })(this);