import { GeoPoint } from '@shared/domain/interfaces/geo-point.interface';

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

export function normalizeCoordinates(lat: number, lng: number): GeoPoint {
    const factor = Math.pow(10, DECIMAL_PRECISION);

    return {
        lat: Math.round(lat * factor) / factor,
        lng: Math.round(lng * factor) / factor,
    };
}

export function formatCoordinatesString(
    lat: number,
    lng: number,
    precision: number = DECIMAL_PRECISION
): string {
    console.log('lat: ', lat);
    console.log('lng: ', lng);
    return `${lat.toFixed(precision)}, ${lng.toFixed(precision)}`;
}
