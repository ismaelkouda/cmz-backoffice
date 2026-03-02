import { Platform } from '@shared/domain/enums/platform.enum';

import { Status } from '@presentation/pages/content-management/domain/enums/slide/slide-status.enum';

export interface SlideFilterDto {
    search?: string;
    platforms?: Platform[];
    status?: Status;
    startDate?: string;
    endDate?: string;
}
