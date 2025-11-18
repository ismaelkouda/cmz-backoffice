import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ConfigurationService } from '@core/services/configuration.service';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
    const configService = inject(ConfigurationService);

    if (isStaticAssetRequest(req)) {
        console.log('🛡️ API Interceptor: Skipping static asset', req.url);
        return next(req);
    }

    if (isAbsoluteUrl(req.url) || isExternalUrl(req.url)) {
        return next(req);
    }

    if (req.url.includes('/assets/i18n/') || req.url.includes('.json')) {
        return next(req);
    }

    if (isAssetRequest(req) || isI18nRequest(req)) {
        return next(req);
    }
    console.log('errorHandlerInterceptor req', req);

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

function isAssetRequest(req: HttpRequest<any>): boolean {
    const assetPatterns = [
        '/assets/',
        '.json',
        '.png',
        '.jpg',
        '.jpeg',
        '.gif',
        '.svg',
        '.css',
        '.js',
        '.woff',
        '.woff2',
        '.ttf',
        '.ico',
    ];

    return assetPatterns.some((pattern) => req.url.includes(pattern));
}

function isI18nRequest(req: HttpRequest<any>): boolean {
    return (
        req.url.includes('/assets/i18n/') ||
        (req.url.includes('.json') && req.url.includes('i18n'))
    );
}

function isStaticAssetRequest(req: HttpRequest<any>): boolean {
    const staticPatterns = [
        '/assets/',
        '/i18n/',
        '.json',
        '.png',
        '.jpg',
        '.jpeg',
        '.gif',
        '.svg',
        '.ico',
        '.css',
        '.js',
        '.woff',
        '.woff2',
        '.ttf',
        'manifest.webmanifest',
        'ngsw-worker.js',
    ];

    return staticPatterns.some((pattern) => req.url.includes(pattern));
}

function isAbsoluteUrl(url: string): boolean {
    return url.startsWith('http://') || url.startsWith('https://');
}

function isExternalUrl(url: string): boolean {
    return (
        isAbsoluteUrl(url) &&
        !url.includes('localhost') &&
        !url.includes('127.0.0.1')
    );
}
