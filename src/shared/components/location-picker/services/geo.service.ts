import { InjectionToken } from '@angular/core';

import { GeocodeResult } from '../models/geo-result.model';
import { ReverseGeocodeResult } from '../models/reverse-geocode-result.model';

export abstract class GeoService {
    abstract geocode(query: string): Promise<GeocodeResult[]>;
    abstract reverseGeocode(
        lat: number,
        lng: number
    ): Promise<ReverseGeocodeResult>;
}

export const GEO_SERVICE = new InjectionToken<GeoService>('GEO_SERVICE');
