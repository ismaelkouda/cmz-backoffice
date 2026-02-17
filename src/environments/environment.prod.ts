import { BuildInfo } from '@environments/config.types';

export const environment = {
    production: true,
    NODE_ENV: 'prod' as const,
    authenticationUrl: 'http://10.10.70.64:7000/auth/v1.0/backoffice/',
    reportUrl: 'http://10.10.70.64:7001/reports/v1.0/backoffice/',
    settingUrl: 'http://10.10.70.64:7002/base-settings/v1.0/backoffice/',
    fileUrl: 'http://10.10.70.64:7000/auth/backoffice/',
    environmentDeployment: 'PROD' as const,
    enableDebug: false,
    buildInfo: {
        timestamp: new Date().toISOString(),
        environment: 'PROD',
        version: '1.0.0',
        commitHash: 'local',
    } as BuildInfo,
};
