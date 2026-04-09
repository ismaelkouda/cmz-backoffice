import { Coordinate } from 'ol/coordinate';
import { fromLonLat, toLonLat } from 'ol/proj';

import {
    isValidCoordinates,
    formatCoordinatesString,
} from './coordinates.validator';

export function toOlCoordinate(lat: number, lng: number): Coordinate {
    if (!isValidCoordinates(lat, lng)) {
        console.warn(
            `[Projection] Coordonnées invalides: ${formatCoordinatesString(lat, lng)}`
        );
        return [0, 0]; // Fallback safe
    }
    return fromLonLat([lng, lat]);
}

export function fromOlCoordinate(olCoord: Coordinate): {
    lat: number;
    lng: number;
} {
    if (!olCoord || olCoord.length !== 2) {
        console.warn('[Projection] Coordonnée OL invalide:', olCoord);
        return { lat: 0, lng: 0 };
    }
    const [lng, lat] = toLonLat(olCoord);
    return { lat, lng };
}

export function getCenterFromBoundingBox(
    bbox: [number, number, number, number]
): { lat: number; lng: number } {
    const [minLng, minLat, maxLng, maxLat] = bbox;
    return {
        lat: (minLat + maxLat) / 2,
        lng: (minLng + maxLng) / 2,
    };
}
