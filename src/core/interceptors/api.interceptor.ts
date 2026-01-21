import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ConfigurationService } from '@core/services/configuration.service';
import {
    isInternalUrl,
    isStaticAssetRequest,
    pickBaseForRelativeEndpoint,
} from './utils/interceptor-request-filter.util';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
    const configService = inject(ConfigurationService);

    if (isStaticAssetRequest(req.url)) return next(req);

    if (!isInternalUrl(req.url, configService)) return next(req);

    if (req.url.startsWith('http')) {
        return next(req);
    }

    const base = pickBaseForRelativeEndpoint(req.url, configService).replace(
        /\/+$/,
        ''
    );
    const clean = req.url.replace(/^\/+/, '');
    const target = `${base}/${clean}`;

    const cloned = req.clone({ url: target });
    return next(cloned);
};
