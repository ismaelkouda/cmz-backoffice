import { InjectionToken } from '@angular/core';

import { GeoLocation } from '../../domain/models/geo-location.model';

export abstract class GeoService {
    abstract geocode(query: string): Promise<GeoLocation[]>;

    abstract reverseGeocode(lat: string, lng: string): Promise<GeoLocation>;
}

export const GEO_SERVICE = new InjectionToken<GeoService>('GEO_SERVICE');
