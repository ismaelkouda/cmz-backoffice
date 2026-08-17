import { Status } from '@pages/administrative-boundary/domain/enums/municipalities/municipalities-status.enum';
export interface MunicipalitiesByDepartmentIdProps {
    uniqId: string;
    name: string;
    code: string;
    description: string;
    region: string;
    populationSize: number;
    status: Status;
    createdAt: string;
    updatedAt: string;
}
