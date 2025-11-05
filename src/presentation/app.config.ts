import {
    provideHttpClient,
    withFetch,
    withInterceptors,
    withJsonpSupport,
} from '@angular/common/http';
import {
    ApplicationConfig,
    importProvidersFrom,
    inject,
    isDevMode,
    provideAppInitializer,
} from '@angular/core';
import {
    provideRouter,
    withInMemoryScrolling,
    withRouterConfig,
    withViewTransitions,
} from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';

import { apiInterceptor } from '../core/interceptors/api.interceptor';
import { authInterceptor } from '../core/interceptors/auth.interceptor';
import { cacheInterceptor } from '../core/interceptors/cache.interceptor';
import { errorHandlerInterceptor } from '../core/interceptors/error-handler.interceptor';
import { loggingInterceptor } from '../core/interceptors/logging.interceptor';

import { TranslationManagerService } from '../core/services/translation-manager.service';

import { ConfigurationService } from '../core/services/configuration.service';

import { CoreModule } from '../core/module/core.module';

import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';

function initializeApp(): () => Promise<void> {
    const configService = inject(ConfigurationService);
    const translationManager = inject(TranslationManagerService);

    return async () => {
        try {
            console.log(`🚀 Application initializing in ${configService.environment} mode`);

            if (!configService.apiUrl) {
                console.warn('⚠️ Configuration API URL manquante');
            }

            await translationManager.initialize();
            
            console.log('🎉 Application initialized successfully');
            
        } catch (error) {
            console.error('💥 Application initialization failed:', error);
        }
    };
}

const coreInterceptors = [
    apiInterceptor,
    authInterceptor,
    errorHandlerInterceptor,
];

const environmentInterceptors = isDevMode()
    ? [loggingInterceptor]
    : [cacheInterceptor];

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(
            routes,
            withViewTransitions(),
            withInMemoryScrolling({
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled',
            }),
            withRouterConfig({
                paramsInheritanceStrategy: 'always',
                onSameUrlNavigation: 'reload',
            })
        ),

        provideHttpClient(
            withFetch(),
            withJsonpSupport(),
            withInterceptors([...coreInterceptors, ...environmentInterceptors])
        ),

        provideTranslateService({
            defaultLanguage: 'fr'
        }),

        ...provideTranslateHttpLoader({
            prefix: './assets/i18n/',
            suffix: '.json',
        }),

        provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000',
        }),

        provideAppInitializer(initializeApp()),

        importProvidersFrom(CoreModule),
    ],
};