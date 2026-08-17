import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { AppConfig, BuildInfo } from '../config/config.types';

@Injectable({
    providedIn: 'root',
})
export class ConfigurationService {
    private readonly config: AppConfig;
    private readonly buildInfo: BuildInfo;
    private readonly configSubject = new BehaviorSubject<AppConfig | null>(
        null
    );
    private readonly platformId = inject(PLATFORM_ID);

    constructor() {
        const loadedConfig = this.loadConfiguration();

        this.config = loadedConfig.config;
        this.buildInfo = loadedConfig.buildInfo;
        this.configSubject.next(this.config);

        this.validateConfiguration();
    }

    private loadConfiguration(): { config: AppConfig; buildInfo: BuildInfo } {
        return this.loadBrowserConfig();
    }

    private loadBrowserConfig(): { config: AppConfig; buildInfo: BuildInfo } {
        const windowConfig = this.getWindowConfig();

        if (!windowConfig) {
            throw new Error('❌ Configuration client non trouvée');
        }

        return {
            config: windowConfig,
            buildInfo: windowConfig.buildInfo || this.createDefaultBuildInfo(),
        };
    }

    private getWindowConfig(): any {
        try {
            if (typeof window !== 'undefined' && (window as any).__env) {
                return (window as any).__env;
            }

            if (
                typeof globalThis !== 'undefined' &&
                (globalThis as any).__env
            ) {
                return (globalThis as any).__env;
            }

            if (typeof self !== 'undefined' && (self as any).__env) {
                return (self as any).__env;
            }

            return null;
        } catch (error) {
            console.warn('⚠️ Error accessing window configuration:', error);
            return null;
        }
    }

    private createDefaultBuildInfo(environment?: string): BuildInfo {
        return {
            environment: environment || 'unknown',
            version: process.env['npm_package_version'] || '1.0.0',
            commitHash: process.env['GIT_COMMIT_HASH'] || 'local',
        };
    }

    private validateConfiguration(): void {
        const requiredProps = [
            'authenticationUrl',
            'reportUrl',
            'settingUrl',
            'fileUrl',
            'environmentDeployment',
        ];
        const missingProps = requiredProps.filter(
            (prop) => !this.config[prop as keyof AppConfig]
        );

        if (missingProps.length > 0) {
            console.error(
                '❌ Configuration incomplète. Propriétés manquantes:',
                missingProps
            );
        }

        if (this.isDevelopment) {
            console.log('🔧 Configuration chargée:', this.config);
            console.log('🏗️ Build Info:', this.buildInfo);
        }
    }

    get authenticationUrl(): string {
        return this.config.authenticationUrl.replace(/\/+$/, '') + '/';
    }

    get reportUrl(): string {
        return this.config.reportUrl.replace(/\/+$/, '') + '/';
    }

    get settingUrl(): string {
        return this.config.settingUrl.replace(/\/+$/, '') + '/';
    }

    get fileUrl(): string {
        return this.config.fileUrl.replace(/\/+$/, '') + '/';
    }

    get environment(): string {
        return this.config.environmentDeployment;
    }

    get isDevelopment(): boolean {
        return this.config.environmentDeployment === 'DEV';
    }

    get isProduction(): boolean {
        return this.config.environmentDeployment === 'PROD';
    }

    get appSettings() {
        return this.config.appSettings || {};
    }

    get buildInformation(): BuildInfo {
        return this.buildInfo;
    }

    get config$(): Observable<AppConfig | null> {
        return this.configSubject.asObservable();
    }

    reloadConfiguration(): void {
        if (isPlatformBrowser(this.platformId) && (globalThis as any).__env) {
            const newConfig = (globalThis as any).__env;
            Object.assign(this.config, newConfig);
            this.configSubject.next(this.config);

            if (this.isDevelopment) {
                console.log('🔄 Configuration rechargée:', this.config);
            }
        }
    }
}
