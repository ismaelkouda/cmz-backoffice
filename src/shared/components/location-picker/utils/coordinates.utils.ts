import { Coordinates } from '@shared/domain/interfaces/coordinates.interface';

export const LAT_MIN = -90;
export const LAT_MAX = 90;
export const LNG_MIN = -180;
export const LNG_MAX = 180;
export const DECIMAL_PRECISION = 6;

function isValidLat(lat: number): boolean {
    return !Number.isNaN(lat) && lat >= LAT_MIN && lat <= LAT_MAX;
}

function isValidLng(lng: number): boolean {
    return !Number.isNaN(lng) && lng >= LNG_MIN && lng <= LNG_MAX;
}

export function isValidCoordinates(lat: number, lng: number): boolean {
    return isValidLat(lat) && isValidLng(lng);
}

export function normalizeCoordinates(lat: number, lng: number): Coordinates {
    const factor = Math.pow(10, DECIMAL_PRECISION);

    return {
        latitude: Math.round(lat * factor) / factor,
        longitude: Math.round(lng * factor) / factor,
    };
}

export function formatCoordinatesString(
    latitude: number,
    longitude: number,
    precision: number = DECIMAL_PRECISION
): string {
    return `${latitude.toFixed(precision)}, ${longitude.toFixed(precision)}`;
}
