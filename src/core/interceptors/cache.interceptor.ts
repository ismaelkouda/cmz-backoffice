import {
    HttpInterceptorFn,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import { of, shareReplay, tap } from 'rxjs';

interface CacheEntry {
    response: HttpResponse<any>;
    timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_DURATION = 300000; // 5 minutes

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
    // Ne pas cacher les requêtes non-GET
    if (req.method !== 'GET') {
        return next(req);
    }

    const cacheKey = createCacheKey(req);
    const cachedResponse = getFromCache(cacheKey);

    if (cachedResponse) {
        return of(cachedResponse.clone());
    }

    return next(req).pipe(
        tap((event) => {
            if (event instanceof HttpResponse) {
                addToCache(cacheKey, event);
            }
        }),
        shareReplay(1)
    );
};

function createCacheKey(req: HttpRequest<any>): string {
    // Utiliser l'URL et les query params pour la clé de cache
    const url = new URL(req.url, globalThis.location.origin);
    const params = Object.fromEntries(url.searchParams);
    return `${req.url}-${JSON.stringify(params)}`;
}

function getFromCache(key: string): HttpResponse<any> | null {
    const cached = cache.get(key);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.response;
    }

    cache.delete(key);
    return null;
}

function addToCache(key: string, response: HttpResponse<any>): void {
    cache.set(key, {
        response: response.clone(),
        timestamp: Date.now(),
    });
}
