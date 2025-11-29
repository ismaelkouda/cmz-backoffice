import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { ConfigurationService } from '@core/services/configuration.service';
import { EncodingDataService } from '@shared/services/encoding-data.service';
import { catchError, throwError } from 'rxjs';
import {
    isInternalUrl,
    isStaticAssetRequest,
} from './utils/request-filter.util';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
    const config = inject(ConfigurationService);
    const encodingDataService = inject(EncodingDataService);

    if (isStaticAssetRequest(req.url)) return next(req);
    if (!isInternalUrl(req.url, config)) return next(req);

    return next(req).pipe(
        catchError((error) => {
            const status = error?.status ?? 0;

            if (config.isDevelopment) {
                console.error('HTTP ERROR:', {
                    url: req.url,
                    method: req.method,
                    status,
                    error,
                });
            }

            if (status === 401) {
                safeHandle401(req, encodingDataService);
            } else if (status === 403) {
                console.warn('Forbidden', req.url);
            } else if (status >= 500) {
                console.error('Server error', req.url);
            }

            return throwError(() => error);
        })
    );
};

function safeHandle401(
    req: HttpRequest<any>,
    encodingDataService: EncodingDataService
): void {
    try {
        if (
            req.url.includes('/auth/') ||
            req.url.includes('/login') ||
            req.url.includes('/token')
        ) {
            return;
        }

        encodingDataService.removeKeysWithPrefix('token_data');
        encodingDataService.removeKeysWithPrefix('user_data');
        encodingDataService.clearData();
        localStorage.clear();
        sessionStorage.clear();
        globalThis.location.href = '/auth/login';
    } catch (e) {
        console.error('safeHandle401 failed', e);
    }
}
