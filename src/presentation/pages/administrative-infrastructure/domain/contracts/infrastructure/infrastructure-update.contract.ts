import { Coordinates } from '@shared/domain/interfaces/coordinates.interface';

export interface InfrastructureUpdateContract {
    uniqId?: string;
    name?: string;
    type?: string;
    position?: Coordinates;
    description?: string;
}
