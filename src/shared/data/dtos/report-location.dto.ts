import { LocationMethod } from '@shared/domain/enums/location-method.enum';
import { LocationType } from '@shared/domain/enums/location-type.enum';
import { Coordinates } from '@shared/domain/interfaces/coordinates.interface';

export interface ReportLocationDto {
    coordinates: Coordinates;
    method: LocationMethod;
    type: LocationType;
    name: string;
    description: string;
}
