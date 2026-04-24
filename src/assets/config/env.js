(function (window) {
            window.__env = {
    "authenticationUrl": "https://api-services.connecte-ma-zone.ansut.ci/auth/v1.0/backoffice/",
    "reportUrl": "https://api-services.connecte-ma-zone.ansut.ci/reports/v1.0/backoffice/",
    "settingUrl": "https://api-services.connecte-ma-zone.ansut.ci/base-settings/v1.0/backoffice/",
    "fileUrl": "https://api-services.connecte-ma-zone.ansut.ci/auth/backoffice/",
    "environmentDeployment": "DEV",
    "enableDebug": true,
    "messageApp": {
        "sourceStockTenantSim": "Le système utilisera une SIM blanche du Stock du Tenant"
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
                timestamp: '2026-04-24T15:34:32.259Z',
                environment: 'cmz_prod',
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