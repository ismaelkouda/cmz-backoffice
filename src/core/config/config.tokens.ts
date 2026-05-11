import { inject, InjectionToken } from '@angular/core';

import type { AppConfig, BuildInfo } from './config.types';

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG', {
    providedIn: 'root',
    factory: (): AppConfig & {
        buildInfo: BuildInfo;
    } => {
        const config = window.__env;

        if (!config) {
            throw new Error('❌ Runtime configuration "__env" is missing.');
        }

        return config;
    },
});

export const REPORT_API_URL = new InjectionToken<string>('REPORT_API_URL', {
    providedIn: 'root',
    factory: (): string => inject(APP_CONFIG).reportUrl,
});

export const AUTH_API_URL = new InjectionToken<string>('AUTH_API_URL', {
    providedIn: 'root',
    factory: (): string => inject(APP_CONFIG).authenticationUrl,
});

export const SETTINGS_API_URL = new InjectionToken<string>('SETTINGS_API_URL', {
    providedIn: 'root',
    factory: (): string => inject(APP_CONFIG).settingUrl,
});

export const FILE_API_URL = new InjectionToken<string>('FILE_API_URL', {
    providedIn: 'root',
    factory: (): string => inject(APP_CONFIG).fileUrl,
});
