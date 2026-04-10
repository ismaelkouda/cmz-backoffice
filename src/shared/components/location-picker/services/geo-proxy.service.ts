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

    async geocode(query: string): Promise<GeocodeResult[]> {
        const key = this.cache.buildKey({ type: 'geocode', query });

        const cached = this.cache.get<GeocodeResult[]>(key);
        if (cached) {
            return cached;
        }

        const result = await lastValueFrom(
            this.http.post<GeocodeResult[]>('/api/geo/geocode', { query })
        );

        this.cache.set(key, result);
        return result;
    }

    async reverseGeocode(
        lat: number,
        lng: number
    ): Promise<ReverseGeocodeResult> {
        const key = this.cache.buildKey({ type: 'reverse', lat, lng });

        const cached = this.cache.get<ReverseGeocodeResult>(key);
        if (cached) {
            return cached;
        }

        const result = await lastValueFrom(
            this.http.post<ReverseGeocodeResult>('/api/geo/reverse', {
                lat,
                lng,
            })
        );

        this.cache.set(key, result);
        return result;
    }
}
