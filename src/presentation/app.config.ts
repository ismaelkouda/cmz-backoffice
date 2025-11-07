import {
    provideHttpClient,
    withFetch,
    withInterceptors,
    withJsonpSupport
} from '@angular/common/http';
import {
    ApplicationConfig,
    EnvironmentInjector,
    importProvidersFrom,
    inject,
    isDevMode,
    provideAppInitializer,
    provideZoneChangeDetection,
    runInInjectionContext,
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
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';


function initializeApp(): () => Promise<void> {
  
  return () => {
        const injector = inject(EnvironmentInjector);
        
        return runInInjectionContext(injector, async () => {
            const configService = inject(ConfigurationService);
            const translationManager = inject(TranslationManagerService);

            try {
                console.log(`🚀 Application initializing in ${configService.environment} mode`);

                if (!configService.authenticationUrl && !configService.reportUrl && !configService.settingUrl ) {
                    throw new Error('Configuration API URL is required');
                }

                await translationManager.initialize();
                
                console.log('🎉 Application initialized successfully');
                
            } catch (error) {
                console.error('💥 Application initialization failed:', error);
                throw error;
            }
        });
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
        provideZoneChangeDetection({ 
            eventCoalescing: true,
            runCoalescing: true 
        }),

        provideRouter(
            routes,
            withViewTransitions({
                skipInitialTransition: true,
                onViewTransitionCreated: (transitionInfo) => {
                    console.log('🎭 View transition created:', transitionInfo);
                }
            }),
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
            defaultLanguage: 'fr',
            useDefaultLang: true,
        }),

        provideTranslateHttpLoader({
            prefix: '../assets/i18n/',
            suffix: '.json'
        }),

        ...provideTranslateHttpLoader({
            prefix: '../assets/i18n/',
            suffix: '.json'
        }),

        provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000',
        }),

        provideToastr({
            timeOut: 5000,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
            progressBar: true,
            closeButton: true,
            newestOnTop: true,
            enableHtml: false,
            tapToDismiss: true,
            
            maxOpened: 5,
            autoDismiss: true,
            iconClasses: {
                error: 'toast-error',
                info: 'toast-info',
                success: 'toast-success',
                warning: 'toast-warning'
            }
        }),

        provideAppInitializer(initializeApp()),

        importProvidersFrom(CoreModule),
    ],
};