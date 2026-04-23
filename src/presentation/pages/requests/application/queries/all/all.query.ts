import { Status } from '@presentation/pages/requests/domain/enums/all/all-status.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';
export class AllQuery {
    constructor(
        public readonly initiatorPhoneNumber?: string,
        public readonly uniqId?: string,
        public readonly reportType?: ReportType,
        public readonly operators?: string[],
        public readonly source?: string,
        public readonly status?: Status,
        public readonly startDate?: string,
        public readonly endDate?: string
    ) {}
}
