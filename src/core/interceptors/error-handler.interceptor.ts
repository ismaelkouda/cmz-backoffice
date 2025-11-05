import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ConfigurationService } from '../services/configuration.service';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
    const configService = inject(ConfigurationService);

    return next(req).pipe(
        catchError((error) => {
            if (configService.isDevelopment) {
                console.error('🚨 HTTP Error:', {
                    url: req.url,
                    method: req.method,
                    error: error.message,
                    environment: configService.environment,
                });
            }

            // Gestion centralisée des erreurs
            handleError(error, req, configService);

            return throwError(() => error);
        })
    );
};

function handleError(
    error: any,
    req: HttpRequest<any>,
    configService: ConfigurationService
): void {
    const errorContext = {
        timestamp: new Date().toISOString(),
        environment: configService.environment,
        url: req.url,
        method: req.method,
        status: error.status,
    };

    // Gestion spécifique par code d'erreur
    switch (error.status) {
        case 401:
            handleUnauthorizedError();
            break;
        case 403:
            console.warn('⛔ Accès interdit');
            break;
        case 500:
            console.error('🔧 Erreur serveur');
            break;
        default:
            if (configService.isDevelopment) {
                console.error('❌ Erreur HTTP:', errorContext);
            }
    }
}

function handleUnauthorizedError(): void {
    if (typeof globalThis !== 'undefined') {
        localStorage.removeItem('auth_token');
        sessionStorage.clear();
        globalThis.location.href = '/auth/login';
    }
}
