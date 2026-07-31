import { Coordinates } from '@shared/domain/interfaces/coordinates.interface';

import { GeoLocation } from '../domain/models/geo-location.model';
import { formatCoordinatesString } from './coordinates.utils';

export function coordinatesToGeoLocation(coords: Coordinates): GeoLocation {
    const displayName =
        coords.what3words ??
        formatCoordinatesString(coords.latitude, coords.longitude);

    return {
        lat: String(coords.latitude),
        lng: String(coords.longitude),
        displayName,
        name: coords.what3words,
    };
}

export function geoLocationToCoordinates(location: GeoLocation): Coordinates {
    return {
        latitude: Number(location.lat),
        longitude: Number(location.lng),
        what3words: location.name || location.displayName,
    };
}
