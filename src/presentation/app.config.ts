import {
    HttpClient,
    provideHttpClient,
    withFetch,
    withInterceptors,
    withJsonpSupport,
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
import { provideAnimations } from '@angular/platform-browser/animations';
import {
    provideRouter,
    withInMemoryScrolling,
    withRouterConfig,
    withViewTransitions,
} from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {
    provideTranslateHttpLoader,
    TranslateHttpLoader,
} from '@ngx-translate/http-loader';
import Aura from '@primeng/themes/aura';
import { provideToastr } from 'ngx-toastr';
import { providePrimeNG } from 'primeng/config';

import { provideMyAccount } from '@shared/components/header/elements/my-account/di/my-account.providers';

/* import { CoreModule } from '../core/core.module'; */
import { historyProviders } from '@shared/components/history/di/history.providers';

import { routes } from '@presentation/app.routes';
import { provideAdministrativeBoundary } from '@presentation/pages/administrative-boundary/di/administrative-boundary.providers';
import { provideAuthentication } from '@presentation/pages/authentication/di/authentication.providers';
import { provideCommunication } from '@presentation/pages/communication/di/communication.providers';
import { provideContentManagement } from '@presentation/pages/content-management/di/content-management.providers';
import { provideDashboard } from '@presentation/pages/dashboard/di/dashboard.providers';
import { provideFinalization } from '@presentation/pages/finalization/di/finalization.providers';
import { provideMonitoring } from '@presentation/pages/monitoring/di/monitoring.providers';
import { providePasswordReset } from '@presentation/pages/password-reset/di/password-reset.providers';
import { provideProcessing } from '@presentation/pages/processing/di/processing.providers';
import { provideReporting } from '@presentation/pages/reporting/di/reporting.providers';
import { provideRequests } from '@presentation/pages/requests/di/requests.providers';
import { provideSettingsSecurity } from '@presentation/pages/settings-security/di/settings-security.providers';
import { provideTeamOrganization } from '@presentation/pages/team-organization/di/team-organisation.providers';

import { apiInterceptor } from '@core/interceptors/api.interceptor';
import { authInterceptor } from '@core/interceptors/auth.interceptor';
import { cacheInterceptor } from '@core/interceptors/cache.interceptor';
import { errorHandlerInterceptor } from '@core/interceptors/error-handler.interceptor';
import { loggingInterceptor } from '@core/interceptors/logging.interceptor';
import { ConfigurationService } from '@core/services/configuration.service';
import { TranslationManagerService } from '@core/services/translation-manager.service';

/* import { provideProfileHabilitation } from '@presentation/pages/settings-security/di/profile-habilitation.providers'; */
/* import { provideUser } from '@presentation/pages/settings-security/di/user.providers';
import { provideParticipant } from '@presentation/pages/team-organization/di/participant.providers';
import { provideTeam } from '@presentation/pages/team-organization/di/team.providers'; */

const frenchLocale = {
    firstDayOfWeek: 1,
    dayNames: [
        'Dimanche',
        'Lundi',
        'Mardi',
        'Mercredi',
        'Jeudi',
        'Vendredi',
        'Samedi',
    ],
    dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    dayNamesMin: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
    monthNames: [
        'Janvier',
        'Février',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Août',
        'Septembre',
        'Octobre',
        'Novembre',
        'Décembre',
    ],
    monthNamesShort: [
        'Jan',
        'Fév',
        'Mar',
        'Avr',
        'Mai',
        'Jun',
        'Jul',
        'Aoû',
        'Sep',
        'Oct',
        'Nov',
        'Déc',
    ],
    today: "Aujourd'hui",
    clear: 'Effacer',
};

export function HttpLoaderFactory(): TranslateHttpLoader {
    return new TranslateHttpLoader();
}

function initializeApp(): () => Promise<void> {
    return () => {
        const injector = inject(EnvironmentInjector);

        return runInInjectionContext(injector, async () => {
            const configService = inject(ConfigurationService);
            const translationManager = inject(TranslationManagerService);

            try {
                console.log(
                    `🚀 Application initializing in ${configService.environment} mode`
                );

                if (
                    !configService.authenticationUrl &&
                    !configService.reportUrl &&
                    !configService.settingUrl &&
                    !configService.fileUrl
                ) {
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
    authInterceptor,
    apiInterceptor,
    errorHandlerInterceptor,
];

const environmentInterceptors = isDevMode()
    ? [loggingInterceptor]
    : [cacheInterceptor];

export const appConfig: ApplicationConfig = {
    providers: [
        /* { provide: APP_BASE_HREF, useValue: '/imako/' }, */

        provideAnimations(),

        provideZoneChangeDetection({
            eventCoalescing: true,
            runCoalescing: true,
        }),

        provideRouter(
            routes,
            withViewTransitions({
                skipInitialTransition: true,
                onViewTransitionCreated: (transitionInfo) => {
                    console.log('🎭 View transition created:', transitionInfo);
                },
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

        importProvidersFrom(
            LoadingBarModule,
            LoadingBarHttpClientModule,
            LoadingBarRouterModule
        ),

        importProvidersFrom(
            TranslateModule.forRoot({
                defaultLanguage: 'fr',
                loader: {
                    provide: TranslateLoader,
                    useFactory: HttpLoaderFactory,
                    deps: [HttpClient],
                },
            })
        ),

        ...provideTranslateHttpLoader({
            prefix: './assets/i18n/',
            suffix: '.json',
        }),

        provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000',
        }),

        provideToastr({
            timeOut: 4000,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
            progressBar: true,
            closeButton: false,
            newestOnTop: true,
            enableHtml: false,
            tapToDismiss: true,
            maxOpened: 5,
            autoDismiss: true,
            iconClasses: {
                error: 'toast-error',
                info: 'toast-info',
                success: 'toast-success',
                warning: 'toast-warning',
            },
        }),

        provideAppInitializer(initializeApp()),

        /* importProvidersFrom(CoreModule), */

        providePrimeNG({
            theme: {
                preset: Aura,
                options: {
                    darkModeSelector: true,
                    /* cssLayer: {
                        name: 'primeng',
                        order: 'tailwind, primeng',
                    }, */
                },
            },
            translation: frenchLocale,
        }),

        ...provideAuthentication(),
        ...provideDashboard(),
        ...provideMyAccount(),
        ...providePasswordReset(),

        ...provideRequests(),
        ...provideProcessing(),
        ...provideFinalization(),

        ...provideReporting(),

        ...provideMonitoring(),

        ...provideCommunication(),

        ...provideTeamOrganization(),

        ...provideContentManagement(),

        ...provideAdministrativeBoundary(),

        ...provideSettingsSecurity(),

        ...historyProviders(),

        /* ...provideUser(), */
        /*  ...provideProfileHabilitation(), */
        /*         ...provideParticipant(),
                ...provideTeam(), */
    ],
};
