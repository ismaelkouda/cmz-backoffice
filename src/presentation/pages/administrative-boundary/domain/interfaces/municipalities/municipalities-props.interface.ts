import { Status } from '@pages/administrative-boundary/domain/enums/municipalities/municipalities-status.enum';

export interface MunicipalitiesProps {
    uniqId: string;
    code: string;
    name: string;
    description: string;
    region: string;
    department: string;
    populationSize: number;
    status: Status;
    createdAt: string;
    updatedAt: string;
}
