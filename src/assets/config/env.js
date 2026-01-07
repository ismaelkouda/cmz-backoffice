(function (window) {
            window.__env = {
    "verifyIdentityDocumentUrl": "https://sim-monitoring.cateli.io:8013/",
    "authenticationUrl": "https://cmz-service-api.paas.imako.digital/auth/v1.0/backoffice/",
    "reportUrl": "https://cmz-service-api.paas.imako.digital/reports/v1.0/backoffice/",
    "settingUrl": "https://cmz-service-api.paas.imako.digital/base-settings/v1.0/backoffice/",
    "fileUrl": "https://cmz-service-api.paas.imako.digital/auth/backoffice/",
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
                timestamp: '2026-01-06T16:56:25.513Z',
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