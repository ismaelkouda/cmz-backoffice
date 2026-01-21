import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ConfigurationService } from '@core/services/configuration.service';
import { of, shareReplay, tap } from 'rxjs';
import {
    isInternalUrl,
    isStaticAssetRequest,
} from './utils/interceptor-request-filter.util';

interface CacheEntry {
    response: HttpResponse<any>;
    timestamp: number;
}
const CACHE_TTL = 5 * 60 * 1000;
const responseCache = new Map<string, CacheEntry>();
const inFlight = new Map<string, any>();

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
    const config = inject(ConfigurationService);

    if (req.method !== 'GET') return next(req);
    if (isStaticAssetRequest(req.url)) return next(req);
    if (!isInternalUrl(req.url, config)) return next(req);

    if (
        req.url.includes('/auth/') ||
        req.url.includes('/login') ||
        req.url.includes('/token')
    ) {
        return next(req);
    }

    const key = req.urlWithParams;

    const cached = responseCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return of(cached.response.clone());
    } else {
        responseCache.delete(key);
    }

    const existing$ = inFlight.get(key);
    if (existing$) return existing$;

    const shared$ = next(req).pipe(
        tap((event) => {
            if (event instanceof HttpResponse && event.status === 200) {
                responseCache.set(key, {
                    response: event.clone(),
                    timestamp: Date.now(),
                });
            }
        }),
        shareReplay({ refCount: true, bufferSize: 1 })
    );

    inFlight.set(key, shared$);
    shared$.subscribe({
        next: () => inFlight.delete(key),
        error: () => inFlight.delete(key),
        complete: () => inFlight.delete(key),
    });

    return shared$;
};
