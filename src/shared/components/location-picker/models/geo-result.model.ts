import { Coordinates } from '@shared/domain/interfaces/coordinates.interface';

export interface GeocodeResult {
    point: Coordinates;
    displayName: string;
    boundingBox?: [number, number, number, number];
    importance?: number;
}
