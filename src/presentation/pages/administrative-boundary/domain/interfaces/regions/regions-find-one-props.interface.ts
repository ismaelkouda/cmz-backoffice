import { Status } from '@pages/administrative-boundary/domain/enums/regions/regions-status.enum';

export interface RegionsFindOneProps {
    uniqId: string;
    name: string;
    code: string;
    description: string;
    populationSize: number;
    infrastructureSize: number;
    departmentsCount: number;
    municipalitiesCount: number;
    status: Status;
    createdAt: string;
    updatedAt: string;
}
