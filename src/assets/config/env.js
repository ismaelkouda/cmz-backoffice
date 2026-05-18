(function (window) {
            window.__env = {
    "authenticationUrl": "http://10.10.70.64:7000/auth/v1.0/backoffice/",
    "reportUrl": "http://10.10.70.64:7001/reports/v1.0/backoffice/",
    "settingUrl": "http://10.10.70.64:7002/base-settings/v1.0/backoffice/",
    "fileUrl": "http://10.10.70.64:7000/auth/backoffice/",
    "environmentDeployment": "DEV",
    "enableDebug": true,
    "appSettings": {
        "app": {
            "name": "Connect My Zone",
            "title": "Connect My Zone Back-office",
            "description": "Système de Gestion des zones non connectées",
            "keywords": "Connect My Zone, Back-office, Gestion, Zones non connectées",
            "author": "ANSUT"
        },
        "fonts": {
            "primary": "'Avenir', 'Futura', sans-serif",
            "secondary": "'Helvetica', sans-serif"
        },
        "colors": {
            "primary": "#2256a3",
            "secondary": "#f08224",
            "tertiary": "#FFFFFF",
            "black": "#1D1D1B",
            "white": "#ffffff",
            "gray": "#878787",
            "grayLight": "#e0e0de",
            "error": "#dc3545",
            "warning": "#ffc107",
            "success": "#28a745",
            "info": "#17a2b8"
        },
        "languages": {
            "supported": [
                "en",
                "fr"
            ],
            "default": "fr",
            "storageKey": "language"
        },
        "modes": {
            "supported": [
                "dark",
                "light",
                "system"
            ],
            "default": "light",
            "storageKey": "mode"
        },
        "assets": {
            "favicon": "favicon.ico",
            "authLogo": "assets/images/logo/app-logo-full.png",
            "sidebarLogo": "https://ansut.ci/data/2023/07/logofooter.svg",
            "logoIcon": "assets/images/favicon.png",
            "loginBg": "assets/images/login/login_bg.jpg"
        },
        "loadingBar": {
            "color": "#2256a3",
            "height": "4px",
            "includeSpinner": false
        },
        "error": {
            "displayStyles": {
                "position": "fixed",
                "top": "0",
                "left": "0",
                "width": "100%",
                "background": "#dc3545",
                "color": "white",
                "padding": "1rem",
                "textAlign": "center",
                "fontFamily": "Arial, sans-serif",
                "zIndex": "9999",
                "boxShadow": "0 2px 4px rgba(0, 0, 0, 0.2)"
            },
            "role": "alert",
            "ariaLive": "assertive"
        },
        "performance": {
            "bootstrapStartMark": "app-bootstrap-start",
            "bootstrapEndMark": "app-bootstrap-end",
            "bootstrapMeasure": "app-bootstrap"
        }
    }
};

            window.__env.buildInfo = {
                timestamp: '2026-05-15T11:38:29.264Z',
                environment: 'dev',
                version: '1.1.0',
                commitHash: 'local'
            };

            Object.freeze(window.__env);

            if (window.__env.appSettings) {
                Object.freeze(window.__env.appSettings);
            }
        })(this);