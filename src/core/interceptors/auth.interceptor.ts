import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { ConfigurationService } from '../services/configuration.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
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
    console.log("authInterceptor req", req)


    const getAuthToken = (): string | null => {
        try {
            return (
                localStorage.getItem('auth_token') ||
                sessionStorage.getItem('auth_token')
            );
        } catch {
            return null; // localStorage non disponible (SSR)
        }
    };

    const authToken = getAuthToken();

    if (authToken) {
        const clonedReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${authToken}`,
                'X-Environment': configService.environment,
            },
        });
        return next(clonedReq);
    }

    return next(req);
};


function isStaticAssetRequest(req: HttpRequest<any>): boolean {
    const staticPatterns = [
        '/assets/',
        '/i18n/',
        '.json',
        '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico',
        '.css', '.js', '.woff', '.woff2', '.ttf',
        'manifest.webmanifest',
        'ngsw-worker.js'
    ];
    
    return staticPatterns.some(pattern => req.url.includes(pattern));
}

function isAbsoluteUrl(url: string): boolean {
    return url.startsWith('http://') || url.startsWith('https://');
}

function isExternalUrl(url: string): boolean {
    return isAbsoluteUrl(url) && !url.includes('localhost') && !url.includes('127.0.0.1');
}
