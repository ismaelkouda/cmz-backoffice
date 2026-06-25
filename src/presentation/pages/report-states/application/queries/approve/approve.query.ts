import { ReportType } from '@shared/domain/enums/report-type.enum';

export class ApproveQuery {
    constructor(
        public readonly initiatorPhoneNumber?: string,
        public readonly uniqId?: string,
        public readonly reportType?: ReportType,
        public readonly operators?: string[],
        public readonly source?: string,
        public readonly startDate?: string,
        public readonly endDate?: string
    ) {}
}
