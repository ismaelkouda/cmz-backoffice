import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { ConfigurationService } from '@core/services/configuration.service';
import { TranslateService } from '@ngx-translate/core';
import { EncodingDataService } from '@shared/services/encoding-data.service';
import { catchError, throwError } from 'rxjs';
import {
    isInternalUrl,
    isStaticAssetRequest,
} from './utils/interceptor-request-filter.util';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
    const config = inject(ConfigurationService);
    const encodingDataService = inject(EncodingDataService);
    const translateService = inject(TranslateService)

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
                translateService.instant(
                    'OVERSEEING_OPERATIONS.MESSAGES.ERROR.UNABLE_TO_FETCH_QUEUES'
                )
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
