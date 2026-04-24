import { Status } from '@pages/administrative-boundary/domain/enums/departments/departments-status.enum';
export interface DepartmentsProps {
    uniqId: string;
    code: string;
    name: string;
    description: string;
    region: string;
    populationSize: number;
    municipalitiesCount: number;
    status: Status;
    createdAt: string;
    updatedAt: string;
}
