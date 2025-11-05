import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ConfigurationService } from '../services/configuration.service';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
    const configService = inject(ConfigurationService);

    // Ne pas intercepter les requêtes absolues vers d'autres domaines
    if (req.url.startsWith('http') && !req.url.includes(configService.apiUrl)) {
        return next(req);
    }

    // Construire l'URL complète pour les URLs relatives
    let targetUrl = req.url;
    
    if (!req.url.startsWith('http')) {
        const baseUrl = configService.apiUrl.replace(/\/+$/, '');
        const cleanEndpoint = req.url.replace(/^\/+/, '');
        targetUrl = `${baseUrl}/${cleanEndpoint}`;
    }

    const clonedReq = req.clone({
        url: targetUrl,
        setHeaders: {
            'X-Environment': configService.environment,
            'X-App-Version': configService.buildInformation.version,
            'X-Client-Time': new Date().toISOString()
        }
    });

    return next(clonedReq);
};