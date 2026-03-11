import { Status } from '@pages/administrative-boundary/domain/enums/regions/regions-status.enum';
export interface RegionsFilterDto {
    search?: string;
    department?: string;
    municipality?: string;
    status?: Status;
    startDate?: string;
    endDate?: string;
}
