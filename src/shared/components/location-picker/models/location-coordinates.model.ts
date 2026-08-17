import { Coordinates } from '@shared/domain/interfaces/coordinates.interface';

export interface LocationCoordinates extends Coordinates {
    address?: string;
    accuracy?: number;
}
