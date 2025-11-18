import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { ConfigurationService } from '@core/services/configuration.service';
import { TokenInterface } from '@shared/interfaces/token.interface';
import { EncodingDataService } from '@shared/services/encoding-data.service';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
    const configService = inject(ConfigurationService);
    const encodingService = inject(EncodingDataService);
    const token = encodingService.getData(
        'token_data'
    ) as TokenInterface | null;

    // Ne pas intercepter les requêtes absolues vers d'autres domaines
    if (
        req.url.startsWith('http') &&
        !req.url.includes(configService.authenticationUrl) &&
        !req.url.includes(configService.reportUrl) &&
        !req.url.includes(configService.settingUrl)
    ) {
        return next(req);
    }
    if (isStaticAssetRequest(req)) {
        console.log('🛡️ API Interceptor: Skipping static asset', req.url);
        return next(req);
    }

    /*     if (isAbsoluteUrl(req.url) || isExternalUrl(req.url)) {
        return next(req);
    } */
    if (req.url.includes('/assets/i18n/') || req.url.includes('.json')) {
        return next(req);
    }
    console.log('authInterceptor req', req);

    // Construire l'URL complète pour les URLs relatives
    let targetUrl = req.url;

    if (!req.url.startsWith('http')) {
        const baseUrl = configService.authenticationUrl.replace(/\/+$/, '');
        const cleanEndpoint = req.url.replace(/^\/+/, '');
        targetUrl = `${baseUrl}/${cleanEndpoint}`;
    }
    const clonedReq = req.clone({
        url: targetUrl,
        setHeaders: {
            Authorization: `Bearer ${token?.value}`,
            'X-Environment': configService.environment,
            'X-App-Version': configService.buildInformation.version,
            'X-Client-Time': new Date().toISOString(),
        },
    });

    return next(clonedReq);
};

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
