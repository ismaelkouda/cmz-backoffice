import { Status } from '@pages/administrative-boundary/domain/enums/municipalities/municipalities-status.enum';

export interface MunicipalitiesByDepartmentIdFilterDto {
    uniqId?: string;
    search?: string;
    region?: string;
    department?: string;
    status?: Status;
    startDate?: string;
    endDate?: string;
}
