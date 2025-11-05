import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ConfigurationService } from '../services/configuration.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const configService = inject(ConfigurationService);

    const getAuthToken = (): string | null => {
        try {
            return (
                localStorage.getItem('auth_token') ||
                sessionStorage.getItem('auth_token')
            );
        } catch {
            return null; // localStorage non disponible (SSR)
        }
    };

    const authToken = getAuthToken();

    if (authToken) {
        const clonedReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${authToken}`,
                'X-Environment': configService.environment,
            },
        });
        return next(clonedReq);
    }

    return next(req);
};
