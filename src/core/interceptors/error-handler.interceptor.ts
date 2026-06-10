import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ConfigurationService } from '@core/services/configuration.service';
import { catchError, throwError } from 'rxjs';

import {
    isInternalUrl,
    isStaticAssetRequest,
} from './utils/interceptor-request-filter.util';
import { httpErrorMapper } from './http-error.mapper';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
    const config = inject(ConfigurationService);

    if (isStaticAssetRequest(req.url)) {
        return next(req);
    }
    if (!isInternalUrl(req.url, config)) {
        return next(req);
    }

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
            const domainError = httpErrorMapper(error);

            return throwError(() => domainError);
        })
    );
};
