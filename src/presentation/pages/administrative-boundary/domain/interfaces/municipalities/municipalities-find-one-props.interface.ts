import { Status } from '@pages/administrative-boundary/domain/enums/municipalities/municipalities-status.enum';

export interface MunicipalitiesFindOneProps {
    uniqId: string;
    name: string;
    code: string;
    description: string;
    region: string;
    department: string;
    populationSize: number;
    status: Status;
    createdAt: string;
    updatedAt: string;
}
