import { Status } from '@pages/content-management/domain/enums/legal-notice/legal-notice-status.enum';

export class LegalNoticeQuery {
    constructor(
        public readonly search?: string,
        public readonly version?: string,
        public readonly status?: Status,
        public readonly startDate?: string,
        public readonly endDate?: string
    ) {}
}
