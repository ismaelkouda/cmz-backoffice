import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';

import { GeocodeResult } from '../models/geo-result.model';
import { ReverseGeocodeResult } from '../models/reverse-geocode-result.model';

import { GeoCacheService } from './geo-cache.service';
import { GeoService } from './geo.service';

@Injectable()
export class GeoProxyService implements GeoService {
    private readonly http = inject(HttpClient);
    private readonly cache = inject(GeoCacheService);

    private readonly CACHE_KEY_PREFIX = {
        GEOCODE: 'geocode_',
        REVERSE: 'reverse_',
    };

    async geocode(query: string): Promise<GeocodeResult[]> {
        if (!query || query.trim().length === 0) {
            return [];
        }

        const cacheKey = `${this.CACHE_KEY_PREFIX.GEOCODE}${query.toLowerCase().trim()}`;

        // Vérification cache
        const cached = this.cache.get<GeocodeResult[]>(cacheKey);
        if (cached) {
            return cached;
        }

        try {
            const results = await lastValueFrom(
                this.http.post<GeocodeResult[]>('/api/geo/geocode', { query })
            );

            if (results && results.length > 0) {
                this.cache.set(cacheKey, results);
            }

            return results || [];
        } catch (error) {
            console.error('[GeoProxy] Geocode failed:', query, error);
            return [];
        }
    }

    async reverseGeocode(
        lat: number,
        lng: number
    ): Promise<ReverseGeocodeResult> {
        const roundedLat = Math.round(lat * 1e6) / 1e6;
        const roundedLng = Math.round(lng * 1e6) / 1e6;
        const cacheKey = `${this.CACHE_KEY_PREFIX.REVERSE}${roundedLat}_${roundedLng}`;

        const cached = this.cache.get<ReverseGeocodeResult>(cacheKey);
        if (cached) {
            return cached;
        }

        try {
            const result = await lastValueFrom(
                this.http.post<ReverseGeocodeResult>('/api/geo/reverse', {
                    lat,
                    lng,
                })
            );

            if (result && result.address) {
                this.cache.set(cacheKey, result);
            }

            return result || { address: '' };
        } catch (error) {
            console.error(
                '[GeoProxy] Reverse geocode failed:',
                { lat, lng },
                error
            );
            return { address: '' };
        }
    }
}
