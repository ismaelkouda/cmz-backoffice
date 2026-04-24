import { Status } from '@pages/administrative-boundary/domain/enums/regions/regions-status.enum';

export interface RegionsProps {
    uniqId: string;
    code: string;
    name: string;
    description: string;
    populationSize: number;
    departmentsCount: number;
    municipalitiesCount: number;
    status: Status;
    createdAt: string;
    updatedAt: string;
}
