import { Status } from '@pages/administrative-boundary/domain/enums/departments/departments-status.enum';
export interface DepartmentsByRegionIdFilterDto {
    uniqId?: string;
    search?: string;
    municipality?: string;
    status?: Status;
    startDate?: string;
    endDate?: string;
}
