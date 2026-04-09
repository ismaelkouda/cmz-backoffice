import { Coordinates } from '@shared/domain/interfaces/coordinates.interface';

export const LAT_MIN = -90;
export const LAT_MAX = 90;
export const LNG_MIN = -180;
export const LNG_MAX = 180;
export const DECIMAL_PRECISION = 6;

export function isValidLat(lat: number): boolean {
    return !Number.isNaN(lat) && lat >= LAT_MIN && lat <= LAT_MAX;
}

export function isValidLng(lng: number): boolean {
    return !Number.isNaN(lng) && lng >= LNG_MIN && lng <= LNG_MAX;
}

export function isValidCoordinates(lat: number, lng: number): boolean {
    return isValidLat(lat) && isValidLng(lng);
}

export function parseCoordinatesString(input: string): Coordinates | null {
    if (!input || typeof input !== 'string') {
        return null;
    }

    const cleaned = input.replaceAll(/\s/g, '').replaceAll(/[;,]/g, ',');
    const parts = cleaned.split(',').filter((p) => p.length > 0);

    if (parts.length !== 2) {
        return null;
    }

    const lat = Number.parseFloat(parts[0]);
    const lng = Number.parseFloat(parts[1]);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
        return null;
    }
    if (!isValidCoordinates(lat, lng)) {
        return null;
    }

    const factor = Math.pow(10, DECIMAL_PRECISION);
    return {
        latitude: Math.round(lat * factor) / factor,
        longitude: Math.round(lng * factor) / factor,
    } as Coordinates;
}

/**
 * Formate des coordonnées en chaîne "lat, lng"
 * @param lat
 * @param lng
 * @param precision
 */
export function formatCoordinatesString(
    lat: number,
    lng: number,
    precision: number = DECIMAL_PRECISION
): string {
    return `${lat.toFixed(precision)}, ${lng.toFixed(precision)}`;
}
