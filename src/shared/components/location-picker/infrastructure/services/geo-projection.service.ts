import { InjectionToken } from '@angular/core';

export abstract class GeoProjectionService {
    abstract toLatLng(coord: any): { lat: number; lng: number };
    abstract toMapProjection(lat: number, lng: number): any;
}

export const GEO_PROJECTION_SERVICE = new InjectionToken<GeoProjectionService>(
    'GEO_PROJECTION_SERVICE'
);
