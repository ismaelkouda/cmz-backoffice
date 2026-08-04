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
        // Si name est vide, prendre le premier segment de display_name
        const name = dto.name?.trim() || dto.display_name.split(',')[0].trim();

        // Extraire municipality ou utiliser un autre champ du address
        const address = dto.address || {};
        const municipality =
            address.municipality ||
            address.village ||
            address.town ||
            address.city ||
            address.county;

        return {
            lat: dto.lat,
            lng: dto.lon,
            displayName: dto.display_name,
            name,
            placeId: dto.place_id,
            municipality,
        };
    }

    fromGeocodeList(results: GeocodeResult[]): GeoLocation[] {
        return results.map(this.fromGeocode.bind(this));
    }
}
