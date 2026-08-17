import { ReportType } from '@shared/domain/enums/report-type.enum';

export class EvaluateQuery {
    constructor(
        public readonly initiatorPhoneNumber?: string,
        public readonly uniqId?: string,
        public readonly reportType?: ReportType,
        public readonly operators?: string[],
        public readonly source?: string,
        public readonly startDate?: Date,
        public readonly endDate?: Date
    ) {}
}
