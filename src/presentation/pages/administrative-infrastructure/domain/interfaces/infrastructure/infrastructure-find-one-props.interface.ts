import { Coordinates } from '@shared/domain/interfaces/coordinates.interface';

export interface InfrastructureFindOneProps {
    uniqId: string;
    name: string;
    type: string;
    description: string;
    region: string;
    department: string;
    municipality: string;
    position: Coordinates;
    createdAt: string;
    updatedAt: string;
}
