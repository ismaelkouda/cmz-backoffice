import { Coordinates } from '@shared/domain/interfaces/coordinates.interface';

export interface LocationPickerData {
    initialCoordinates?: Coordinates;
    initialZoom?: number;
}
