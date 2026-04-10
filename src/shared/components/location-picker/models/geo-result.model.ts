import { GeoPoint } from '@shared/domain/interfaces/geo-point.interface';

export interface GeocodeResult {
    point: GeoPoint;
    displayName: string;
    boundingBox?: [number, number, number, number];
    importance?: number;
}
