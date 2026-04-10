import { GeoPoint } from '@shared/domain/interfaces/geo-point.interface';

export interface LocationCoordinates extends GeoPoint {
    address?: string;
    what3words?: string;
    accuracy?: number;
}
