import { Platform } from '@shared/domain/enums/platform.enum';

import { Status } from '@presentation/pages/content-management/domain/enums/home/home-status.enum';

export interface HomeFilterDto {
    search?: string;
    platforms?: Platform[];
    status?: Status;
    startDate?: string;
    endDate?: string;
}
