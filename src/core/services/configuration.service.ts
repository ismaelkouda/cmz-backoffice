import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppConfig, BuildInfo } from '../../environments/config.types';

@Injectable({
    providedIn: 'root',
})

export class ConfigurationService {
    private readonly config: AppConfig;
    private readonly buildInfo: BuildInfo;
    private configSubject = new BehaviorSubject<AppConfig | null>(null);

    constructor(@Inject(PLATFORM_ID) private platformId: any) {
        const loadedConfig = this.loadConfiguration();

        this.config = loadedConfig.config;
        this.buildInfo = loadedConfig.buildInfo;
        this.configSubject.next(this.config);

        this.validateConfiguration();
    }

    private loadConfiguration(): { config: AppConfig; buildInfo: BuildInfo } {
        if (isPlatformBrowser(this.platformId)) {
            return this.loadBrowserConfig();
        } else {
            return this.loadServerConfig();
        }
    }

    private loadBrowserConfig(): { config: AppConfig; buildInfo: BuildInfo } {
        const windowConfig = this.getWindowConfig();
        console.log("azerty", (globalThis))

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
      // Essayer multiple méthodes d'accès
      if (typeof window !== 'undefined' && (window as any).__env) {
        return (window as any).__env;
      }
      
      if (typeof globalThis !== 'undefined' && (globalThis as any).__env) {
        return (globalThis as any).__env;;
      }
      
      if (typeof self !== 'undefined' && (self as any).__env) {
        return (self as any).__env;;
      }

      return null;
    } catch (error) {
      console.warn('⚠️ Error accessing window configuration:', error);
      return null;
    }
  }

    private loadServerConfig(): { config: AppConfig; buildInfo: BuildInfo } {
        const nodeEnv =
            (process.env['NODE_ENV'] as 'dev' | 'test' | 'prod') || 'dev';

        // Import dynamique pour éviter les références circulaires
        const configs = {
            dev: {
                verifyIdentityDocumentUrl:
                    'https://sim-monitoring.cateli.io:8013/',
                apiUrl: 'https://services-care-portal-service-api.paas.imako.digital/api/v1/',
                fileUrl:
                    'https://services-care-portal-service-api.paas.imako.digital/',
                environmentDeployment: 'DEV' as const,
                enableDebug: true,
                messageApp: {
                    sourceStockTenantSim:
                        'Le système utilisera une SIM blanche du Stock du Tenant',
                    sourceStockOrangeSim: 'Orange fournira la SIM...',
                    sourceSoldeDotation: 'Le solde de la dotation Data...',
                    sourceSoldeDotationOrange: 'Orange fera le dépôt...',
                },
                appSettings: {
                    appName: 'IMAKO',
                    appLogoFull: 'assets/images/logo/logo-ansut-full.png',
                    appLogoIcon: 'assets/images/favicon.png',
                    appPrimaryColor: '#0566FF',
                    appSecondaryColor: '#F08224',
                    appTertiaryColor: '#FFFFFF',
                },
            },
            test: {
                verifyIdentityDocumentUrl:
                    'https://sim-monitoring.cateli.io:8013/',
                apiUrl: 'http://10.10.0.200:12555/api/v1/',
                fileUrl: 'http://10.10.0.200:12555/',
                environmentDeployment: 'TEST' as const,
                enableDebug: true,
            },
            prod: {
                verifyIdentityDocumentUrl:
                    'https://sim-monitoring.cateli.io:8013/',
                apiUrl: 'https://sim-monitoring.cateli.io:12555/api/v1/',
                fileUrl: 'https://sim-monitoring.cateli.io:12555/',
                environmentDeployment: 'PROD' as const,
                enableDebug: false,
            },
        };

        return {
            config: configs[nodeEnv],
            buildInfo: this.createDefaultBuildInfo(nodeEnv),
        };
    }

    private createDefaultBuildInfo(environment?: string): BuildInfo {
        return {
            timestamp: new Date().toISOString(),
            environment: environment || 'unknown',
            version: process.env['npm_package_version'] || '1.0.0',
            commitHash: process.env['GIT_COMMIT_HASH'] || 'local',
        };
    }

    private validateConfiguration(): void {
        const requiredProps = ['apiUrl', 'fileUrl', 'environmentDeployment'];
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

    get apiUrl(): string {
        return this.config.apiUrl.replace(/\/+$/, '') + '/';
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

    get isTest(): boolean {
        return this.config.environmentDeployment === 'TEST';
    }

    get appSettings() {
        return this.config.appSettings || {};
    }

    get messageApp() {
        return this.config.messageApp || {};
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
