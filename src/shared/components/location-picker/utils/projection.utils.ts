import { Coordinate } from 'ol/coordinate';
import { fromLonLat, toLonLat } from 'ol/proj';

import {
    isValidCoordinates,
    formatCoordinatesString,
} from './coordinates.utils';
import { DEFAULT_CENTER_IVORY_COAST } from './lat-lng.utils';

export function toOlCoordinate(latitude: any, longitude: any): Coordinate {
    if (!isValidCoordinates(latitude, longitude)) {
        console.warn(
            `[Projection] Coordonnées invalides: ${formatCoordinatesString(latitude, longitude)}`
        );
        return toOlCoordinate(
            DEFAULT_CENTER_IVORY_COAST.latitude,
            DEFAULT_CENTER_IVORY_COAST.longitude
        );
    }
    return fromLonLat([longitude, latitude]);
}

export function fromOlCoordinate(olCoord: Coordinate): {
    latitude: number;
    longitude: number;
} {
    if (!olCoord || olCoord.length !== 2) {
        console.warn('[Projection] Coordonnée OL invalide:', olCoord);
        return { latitude: 0, longitude: 0 };
    }
    const [longitude, latitude] = toLonLat(olCoord);
    return { latitude, longitude };
}

export function getCenterFromBoundingBox(
    bbox: [number, number, number, number]
): { latitude: number; longitude: number } {
    const [minLng, minLat, maxLng, maxLat] = bbox;
    return {
        latitude: (minLat + maxLat) / 2,
        longitude: (minLng + maxLng) / 2,
    };
}
