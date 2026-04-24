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

export function parseCoordinates(query: string): Coordinates | null {
    const cleaned = query
        .replace(/[°'"′″]/g, ' ')
        .replace(/,/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    const decimalMatch = cleaned.match(/^(-?\d+\.?\d*)\s+(-?\d+\.?\d*)$/);
    if (decimalMatch) {
        const lat = parseFloat(decimalMatch[1]);
        const lng = parseFloat(decimalMatch[2]);
        if (isValidCoordinates(lat, lng)) {
            return { latitude: lat, longitude: lng };
        }
    }

    const dmsMatch = cleaned.match(
        /^(\d+)\s+(\d+)\s+(\d+(?:\.\d+)?)\s*([NS]?)\s+(\d+)\s+(\d+)\s+(\d+(?:\.\d+)?)\s*([EW]?)$/i
    );

    if (dmsMatch) {
        const latDeg = parseInt(dmsMatch[1]);
        const latMin = parseInt(dmsMatch[2]);
        const latSec = parseFloat(dmsMatch[3]);
        const latDir = (dmsMatch[4] || '').toUpperCase();

        const lngDeg = parseInt(dmsMatch[5]);
        const lngMin = parseInt(dmsMatch[6]);
        const lngSec = parseFloat(dmsMatch[7]);
        const lngDir = (dmsMatch[8] || '').toUpperCase();

        let lat = latDeg + latMin / 60 + latSec / 3600;
        let lng = lngDeg + lngMin / 60 + lngSec / 3600;

        if (latDir === 'S') {
            lat = -lat;
        }
        if (lngDir === 'W') {
            lng = -lng;
        }

        if (isValidCoordinates(lat, lng)) {
            return normalizeCoordinates(lat, lng);
        }
    }

    return null;
}
