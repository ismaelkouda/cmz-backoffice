import { Coordinates } from '@shared/domain/interfaces/coordinates.interface';

export interface InfrastructureCreateDto {
    name?: string;
    type?: string;
    position?: Coordinates;
    description?: string;
}
