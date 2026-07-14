import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';

import { GeocodeResult } from '../dto/geo-result.model';

import { GeoCacheService } from './geo-cache.service';
import { GeoService } from './geo.service';
import { GeoLocationMapper } from '../mappers/geo-location.mapper';
import { GeoLocation } from '../../domain/models/geo-location.model';
import { ReverseGeocodeResult } from '../dto/reverse-geo-result.model';

@Injectable()
export class GeoProxyService implements GeoService {
    private readonly http = inject(HttpClient);
    private readonly cache = inject(GeoCacheService);
    private readonly locationMapper = inject(GeoLocationMapper);

    async geocode(query: string): Promise<GeoLocation[]> {
        const key = this.cache.buildKey({ type: 'geocode', query });

        const cached = this.cache.get<GeoLocation[]>(key);
        if (cached) {
            return cached;
        }

        const dto = await lastValueFrom(
            this.http.get<GeocodeResult[]>(
                'https://nominatim.openstreetmap.org/search',
                {
                    params: {
                        format: 'jsonv2',
                        q: query,
                        limit: '6',
                        countrycodes: 'ci',
                        bounded: '1',
                        viewbox: '-8.60,10.75,-2.45,4.35',
                        addressdetails: '1',
                    },
                }
            )
        );
        console.log('dto: ', dto);

        const locations = this.locationMapper.fromGeocodeList(dto);

        this.cache.set(key, locations);
        return locations;
    }

    async reverseGeocode(lat: string, lng: string): Promise<GeoLocation> {
        const key = this.cache.buildKey({ type: 'reverse', lat, lng });

        const cached = this.cache.get<GeoLocation>(key);
        if (cached) {
            return cached;
        }

        const dto = await lastValueFrom(
            this.http.post<ReverseGeocodeResult>('/api/geo/reverse', {
                lat,
                lng,
            })
        );

        const location = this.locationMapper.fromReverse(dto);

        this.cache.set(key, location);
        return location;
    }
}
