import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from '@presentation/app.config';
import { AppComponent } from './presentation/app.component';
import { DEFAULT_CUSTOMIZATION } from './shared/services/app-customization.config';

const PERFORMANCE_CONFIG = {
    bootstrapStartMark: DEFAULT_CUSTOMIZATION.performance.bootstrapStartMark,
    bootstrapEndMark: DEFAULT_CUSTOMIZATION.performance.bootstrapEndMark,
    bootstrapMeasure: DEFAULT_CUSTOMIZATION.performance.bootstrapMeasure,
} as const;

const ERROR_DISPLAY_CONFIG = {
    styles: DEFAULT_CUSTOMIZATION.error.displayStyles,
    role: DEFAULT_CUSTOMIZATION.error.role,
    ariaLive: DEFAULT_CUSTOMIZATION.error.ariaLive,
} as const;

function setupGlobalErrorHandlers(): void {
    if (globalThis.window === undefined) {
        return;
    }

    globalThis.window.addEventListener('error', (event: ErrorEvent) => {
        console.error('APP.ERROR.GLOBAL', event.error);
    });

    globalThis.window.addEventListener(
        'unhandledrejection',
        (event: PromiseRejectionEvent) => {
            console.error(
                'APP.ERROR.UNHANDLED_PROMISE_REJECTION',
                event.reason
            );
            event.preventDefault();
        }
    );
}

function measureBootstrapPerformance(): void {
    if (typeof performance === 'undefined') {
        return;
    }

    try {
        performance.mark(PERFORMANCE_CONFIG.bootstrapEndMark);
        performance.measure(
            PERFORMANCE_CONFIG.bootstrapMeasure,
            PERFORMANCE_CONFIG.bootstrapStartMark,
            PERFORMANCE_CONFIG.bootstrapEndMark
        );

        const measure = performance.getEntriesByName(
            PERFORMANCE_CONFIG.bootstrapMeasure
        )[0];
        if (measure && 'duration' in measure) {
            console.log(
                `APP.BOOTSTRAP.SUCCESS - ${measure.duration.toFixed(2)}ms`
            );
        }
    } catch (error) {
        console.warn('APP.BOOTSTRAP.PERFORMANCE_MEASUREMENT_FAILED', error);
    }
}

/**
 * Affiche une erreur de bootstrap de manière visible
 * @private
 * @param {Error | unknown} error - Erreur à afficher
 * @returns {void}
 */
function displayBootstrapError(error: Error): void {
    if (typeof document === 'undefined') {
        return;
    }

    const errorMessage =
        error instanceof Error ? error.message : 'APP.BOOTSTRAP.ERROR_UNKNOWN';

    const errorElement = document.createElement('div');
    errorElement.setAttribute('role', ERROR_DISPLAY_CONFIG.role);
    errorElement.setAttribute('aria-live', ERROR_DISPLAY_CONFIG.ariaLive);

    // Appliquer les styles
    const styles = ERROR_DISPLAY_CONFIG.styles;
    errorElement.style.cssText = Object.entries(styles)
        .map(([key, value]) => {
            const cssKey = key.replaceAll(
                /[A-Z]/g,
                (letter) => `-${letter.toLowerCase()}`
            );
            return `${cssKey}: ${value};`;
        })
        .join(' ');

    // Contenu HTML (sera remplacé par i18n dans le composant)
    errorElement.innerHTML = `
        <strong>APP.BOOTSTRAP.ERROR_TITLE</strong>
        <p>APP.BOOTSTRAP.ERROR_MESSAGE</p>
        <small>Error: ${errorMessage}</small>
    `;

    document.body.appendChild(errorElement);
}

/**
 * Point d'entrée principal de l'application Angular
 * Configure les gestionnaires d'erreurs, mesure les performances et bootstrap l'application
 * @returns {void}
 */
function bootstrapApp(): void {
    try {
        // Configurer les gestionnaires d'erreurs globaux
        setupGlobalErrorHandlers();

        // Marquer le début du bootstrap pour mesurer les performances
        if (typeof performance !== 'undefined') {
            performance.mark(PERFORMANCE_CONFIG.bootstrapStartMark);
        }

        // Bootstrap l'application
        bootstrapApplication(AppComponent, appConfig)
            .then(() => {
                measureBootstrapPerformance();
                console.log('APP.BOOTSTRAP.SUCCESS');
            })
            .catch((error: Error) => {
                console.error('APP.BOOTSTRAP.FAILED', error);
                displayBootstrapError(error);
            });
    } catch (error) {
        const bootstrapError =
            error instanceof Error ? error : new Error(String(error));
        console.error('APP.BOOTSTRAP.FAILED', bootstrapError);
        displayBootstrapError(bootstrapError);
    }
}

bootstrapApp();
