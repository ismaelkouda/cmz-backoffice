import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import {
    isInternalUrl,
    isStaticAssetRequest,
} from '@core/interceptors/utils/interceptor-request-filter.util';
import { ConfigurationService } from '@core/services/configuration.service';
import { AuthToken } from '@shared/domain/interfaces/current-user.interface';
import { EncodingDataService } from '@shared/domain/services/encoding-data.service';

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
    const token = tokenData?.value;

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
