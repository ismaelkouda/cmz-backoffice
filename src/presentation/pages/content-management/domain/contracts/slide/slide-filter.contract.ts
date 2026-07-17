import { Status } from '@pages/content-management/domain/enums/slide/slide-status.enum';
import { Platform } from '@shared/domain/enums/platform.enum';

export interface SlideFilterContract {
    search?: string;
    platforms?: Platform[];
    status?: Status;
    startDate?: string;
    endDate?: string;
}
