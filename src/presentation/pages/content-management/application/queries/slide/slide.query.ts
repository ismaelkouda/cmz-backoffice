import { Status } from '@pages/content-management/domain/enums/slide/slide-status.enum';
import { Platform } from '@shared/domain/enums/platform.enum';

export class SlideQuery {
    constructor(
        public readonly search?: string,
        public readonly platforms?: Platform[],
        public readonly status?: Status,
        public readonly startDate?: string,
        public readonly endDate?: string
    ) {}
}
