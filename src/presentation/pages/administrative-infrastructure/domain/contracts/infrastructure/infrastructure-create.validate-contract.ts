import { Coordinates } from '@shared/domain/interfaces/coordinates.interface';

export interface InfrastructureCreateValidateContract {
    name: string;
    type: string;
    position: Coordinates;
    description: string;
}
