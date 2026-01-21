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
import {
    provideRouter,
    withInMemoryScrolling,
    withRouterConfig,
    withViewTransitions,
} from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';

import { provideAnimations } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { provideTranslateHttpLoader, TranslateHttpLoader } from '@ngx-translate/http-loader';
import Aura from '@primeng/themes/aura';
import { provideToastr } from 'ngx-toastr';
import { providePrimeNG } from 'primeng/config';
/* import { CoreModule } from '../core/core.module'; */
import { apiInterceptor } from '../core/interceptors/api.interceptor';
import { authInterceptor } from '../core/interceptors/auth.interceptor';
import { cacheInterceptor } from '../core/interceptors/cache.interceptor';
import { errorHandlerInterceptor } from '../core/interceptors/error-handler.interceptor';
import { loggingInterceptor } from '../core/interceptors/logging.interceptor';

import { ConfigurationService } from '../core/services/configuration.service';
import { TranslationManagerService } from '../core/services/translation-manager.service';
import { routes } from './app.routes';
import { provideAuthentication } from './pages/authentication/di/authentication.providers';
import { provideDashboard } from './pages/dashboard/di/dashboard.providers';

import { provideAll as finalizationAll } from './pages/finalization/di/all.providers';
import { provideAll as requestsAll } from './pages/report-requests/di/all.providers';
import { provideAll as processingAll } from './pages/reports-processing/di/all.providers';

import { provideQueues as finalizationQueues } from './pages/finalization/di/queues.providers';
import { provideQueues as requestsQueues } from './pages/report-requests/di/queues.providers';
import { provideQueues as processingQueues } from './pages/reports-processing/di/queues.providers';

import { provideTasks as finalizationTasks } from './pages/finalization/di/tasks.providers';
import { provideTasks as requestsTasks } from './pages/report-requests/di/tasks.providers';
import { provideTasks as processingTasks } from './pages/reports-processing/di/tasks.providers';

import { provideTreatment } from './pages/reports-processing/di/treatment.providers';

import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { provideMyAccount } from '@shared/components/header/elements/my-account/di/my-account.providers';
import { provideAdministrativeBoundary } from './pages/administrative-boundary/di/administrative-boundary.providers';
import { provideNotifications } from './pages/communication/di/notifications.providers';
import { provideHome } from './pages/content-management/di/home.providers';
import { provideLegalNotice } from './pages/content-management/di/legal-notice.providers';
import { provideNews } from './pages/content-management/di/news.providers';
import { providePrivacyPolicy } from './pages/content-management/di/privacy-policy.providers';
import { provideSlide } from './pages/content-management/di/slide.providers';
import { provideTermsUse } from './pages/content-management/di/terms-use.providers';
import { providePasswordReset } from './pages/password-reset/di/password-reset.providers';
import { provideReporting } from './pages/reporting/di/reporting.providers';
import { provideActions } from './pages/reports-processing/di/actions.providers';
import { provideDetails } from './pages/reports-processing/di/details.providers';
import { provideManagement } from './pages/reports-processing/di/management.providers';
/* import { provideProfileHabilitation } from './pages/settings-security/di/profile-habilitation.providers'; */
/* import { provideUser } from './pages/settings-security/di/user.providers';
import { provideParticipant } from './pages/team-organization/di/participant.providers';
import { provideTeam } from './pages/team-organization/di/team.providers'; */

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

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
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
                    deps: [HttpClient]
                }
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

        ...requestsQueues(),
        ...processingQueues(),
        ...finalizationQueues(),

        ...requestsTasks(),
        ...processingTasks(),
        ...finalizationTasks(),

        ...requestsAll(),
        ...processingAll(),
        ...finalizationAll(),

        ...provideReporting(),

        ...provideActions(),

        ...provideNotifications(),

        ...provideDetails(),
        ...provideTreatment(),
        ...processingTasks(),
        ...provideManagement(),

        ...provideAdministrativeBoundary(),

        ...provideHome(),
        ...provideSlide(),
        ...provideNews(),
        ...providePrivacyPolicy(),
        ...provideLegalNotice(),
        ...provideTermsUse(),
        /* ...provideUser(), */
        /*  ...provideProfileHabilitation(), */
        /*         ...provideParticipant(),
                ...provideTeam(), */
    ],
};
