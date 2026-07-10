import { Injectable } from '@angular/core';
import { GeoLocation } from '../../domain/models/geo-location.model';
import { GeocodeResult } from '../dto/geo-result.model';
import { ReverseGeocodeResult } from '../dto/reverse-geo-result.model';

@Injectable({ providedIn: 'root' })
export class GeoLocationMapper {
    fromGeocode(dto: GeocodeResult): GeoLocation {
        return {
            lat: dto.lat,
            lng: dto.lon,
            displayName: dto.display_name,
            name: dto.name,
            placeId: dto.place_id,
        };
    }

    fromReverse(dto: ReverseGeocodeResult): GeoLocation {
        return {
            lat: dto.lat,

            lng: dto.lon,

            displayName: dto.display_name,

            name: dto.name,

            placeId: dto.place_id,

            municipality: dto.address.municipality,
        };
    }

    fromGeocodeList(results: GeocodeResult[]): GeoLocation[] {
        return results.map(this.fromGeocode.bind(this));
    }
}
