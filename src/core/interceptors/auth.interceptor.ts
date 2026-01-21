import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ConfigurationService } from '@core/services/configuration.service';
import { AuthToken } from '@shared/interfaces/current-user.interface';
import { EncodingDataService } from '@shared/services/encoding-data.service';
import {
    isInternalUrl,
    isStaticAssetRequest,
} from './utils/interceptor-request-filter.util';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const configService = inject(ConfigurationService);
    const encodingService = inject(EncodingDataService);

    if (isStaticAssetRequest(req.url)) {
        return next(req);
    }

    if (!isInternalUrl(req.url, configService)) {
        return next(req);
    }

    const tokenData: AuthToken | null = encodingService.getData('token_data');
    const token =
        tokenData?.value ??
        localStorage.getItem('auth_token') ??
        sessionStorage.getItem('auth_token');

    if (!token) {
        return next(req);
    }

    const cloned = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`,
            'X-Environment': configService.environment,
        },
    });

    return next(cloned);
};
