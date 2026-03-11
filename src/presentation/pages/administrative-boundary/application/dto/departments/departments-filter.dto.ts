import { Status } from '@pages/administrative-boundary/domain/enums/departments/departments-status.enum';

export interface DepartmentsFilterDto {
    search?: string;
    region?: string;
    municipality?: string;
    status?: Status;
    startDate?: string;
    endDate?: string;
}
