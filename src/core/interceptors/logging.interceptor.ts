import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { ConfigurationService } from '../services/configuration.service';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
    const configService = inject(ConfigurationService);
    const startTime = Date.now();

    if (isAssetRequest(req) || isI18nRequest(req)) {
        return next(req); // Passer sans interception
    }

    return next(req).pipe(
        tap({
            next: (event) => {
                if (configService.isDevelopment) {
                    const duration = Date.now() - startTime;

                    console.group(`🌐 ${req.method} ${req.url}`);
                    console.log(`⏱️  Duration: ${duration}ms`);
                    console.log(`📤 Request:`, req.body);
                    console.log(`📥 Response:`, event);
                    console.log(`🏷️  Type: ${event.type}`);
                    console.groupEnd();
                }
            },
            error: (error) => {
                if (configService.isDevelopment) {
                    const duration = Date.now() - startTime;

                    console.group(`🚨 ${req.method} ${req.url}`);
                    console.log(`⏱️  Duration: ${duration}ms`);
                    console.log(`📤 Request:`, req.body);
                    console.log(`💥 Error:`, error);
                    console.log(`📋 Error Details:`, {
                        status: error.status,
                        message: error.message,
                        url: error.url,
                    });
                    console.groupEnd();
                }
            },
        })
    );
};

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
        '.ico'
    ];

    return assetPatterns.some(pattern => 
        req.url.includes(pattern)
    );
}

function isI18nRequest(req: HttpRequest<any>): boolean {
    return req.url.includes('/assets/i18n/') || 
           req.url.includes('.json') && req.url.includes('i18n');
}