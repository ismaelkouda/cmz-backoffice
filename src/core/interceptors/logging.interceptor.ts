import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ConfigurationService } from '@core/services/configuration.service';
import { tap } from 'rxjs';
import {
    isInternalUrl,
    isStaticAssetRequest,
} from './utils/interceptor-request-filter.util';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
    const config = inject(ConfigurationService);
    const start = Date.now();

    if (isStaticAssetRequest(req.url)) return next(req);
    if (!isInternalUrl(req.url, config)) return next(req);

    return next(req).pipe(
        tap({
            next: (event) => {
                if (!config.isDevelopment) return;
            },
            error: (err) => {
                if (!config.isDevelopment) return;
                const duration = Date.now() - start;
                console.groupCollapsed(
                    `ERROR ${req.method} ${req.urlWithParams} (${duration}ms)`
                );
                console.groupEnd();
            },
        })
    );
};
