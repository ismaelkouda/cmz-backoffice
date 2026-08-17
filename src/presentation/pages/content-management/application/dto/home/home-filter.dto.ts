import { Status } from '@pages/content-management/domain/enums/home/home-status.enum';
import { Platform } from '@shared/domain/enums/platform.enum';

export interface HomeFilterDto {
    search?: string;
    platforms?: Platform[];
    status?: Status;
    startDate?: string;
    endDate?: string;
}
