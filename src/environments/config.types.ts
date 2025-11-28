// ⚠️ GENERATED FILE - DO NOT EDIT MANUALLY
// Generated at: 2025-11-28T18:28:16.405Z

export interface AppConfig {
    verifyIdentityDocumentUrl: string;
    authenticationUrl: string;
    reportUrl: string;
    settingUrl: string;
    fileUrl: string;
    environmentDeployment: 'DEV' | 'TEST' | 'PROD';
    enableDebug: boolean;
    messageApp?: {
        sourceStockTenantSim: string;
        sourceStockOrangeSim: string;
        sourceSoldeDotation: string;
        sourceSoldeDotationOrange: string;
    };
    appSettings?: {
        appName: string;
        appLogoFull: string;
        appLogoIcon: string;
        appPrimaryColor: string;
        appSecondaryColor: string;
        appTertiaryColor: string;
    };
}

export interface BuildInfo {
    timestamp: string;
    environment: string;
    version: string;
    commitHash: string;
}

declare global {
    interface Window {
        __env: AppConfig & { buildInfo: BuildInfo };
    }
}

// Environment-specific configurations
export const ENVIRONMENTS = {
  "dev": {
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
  },
  "test": {
    "verifyIdentityDocumentUrl": "https://sim-monitoring.cateli.io:8013/",
    "authenticationUrl": "http://10.10.70.64:7000/auth/v1.0/backoffice/",
    "reportUrl": "http://10.10.70.64:7001/reports/v1.0/backoffice/",
    "settingUrl": "http://10.10.70.64:7002/base-settings/v1.0/backoffice/",
    "fileUrl": "http://10.10.0.200:12555/",
    "environmentDeployment": "TEST",
    "enableDebug": true
  },
  "prod": {
    "verifyIdentityDocumentUrl": "https://sim-monitoring.cateli.io:8013/",
    "authenticationUrl": "http://10.10.70.64:7000/auth/v1.0/backoffice/",
    "reportUrl": "http://10.10.70.64:7001/reports/v1.0/backoffice/",
    "settingUrl": "http://10.10.70.64:7002/base-settings/v1.0/backoffice/",
    "fileUrl": "https://sim-monitoring.cateli.io:12555/",
    "environmentDeployment": "PROD",
    "enableDebug": false
  }
} as const;

export type EnvironmentName = keyof typeof ENVIRONMENTS;
