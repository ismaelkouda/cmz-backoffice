import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import {
    isInternalUrl,
    isStaticAssetRequest,
} from '@core/interceptors/utils/interceptor-request-filter.util';
import { ConfigurationService } from '@core/services/configuration.service';
import { tap } from 'rxjs';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
    const config = inject(ConfigurationService);
    const start = Date.now();

    if (isStaticAssetRequest(req.url)) {
        return next(req);
    }
    if (!isInternalUrl(req.url, config)) {
        return next(req);
    }

    return next(req).pipe(
        tap({
            next: (event) => {
                console.log(event);
                // if (!config.isDevelopment) {
                //     return;
                // }
            },
            error: (err) => {
                console.log(err);
                if (!config.isDevelopment) {
                    return;
                }
                const duration = Date.now() - start;
                console.groupCollapsed(
                    `ERROR ${req.method} ${req.urlWithParams} (${duration}ms)`
                );
                console.groupEnd();
            },
        })
    );
};
