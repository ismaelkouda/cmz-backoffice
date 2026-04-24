import { Status } from '@pages/administrative-boundary/domain/enums/departments/departments-status.enum';

export interface DepartmentsByRegionIdProps {
    uniqId: string;
    name: string;
    code: string;
    description: string;
    populationSize: number;
    municipalitiesCount: number;
    status: Status;
    createdAt: string;
    updatedAt: string;
}
