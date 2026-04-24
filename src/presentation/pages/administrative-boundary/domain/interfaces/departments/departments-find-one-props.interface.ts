import { Status } from '@pages/administrative-boundary/domain/enums/departments/departments-status.enum';

export interface DepartmentsFindOneProps {
    uniqId: string;
    name: string;
    code: string;
    description: string;
    region: string;
    populationSize: number;
    municipalitiesCount: number;
    status: Status;
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
}
