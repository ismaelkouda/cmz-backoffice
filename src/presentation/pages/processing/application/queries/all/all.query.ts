import { State } from '@presentation/pages/processing/domain/enums/all/all-state.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';

export class AllQuery {
    constructor(
        public readonly initiatorPhoneNumber?: string,
        public readonly uniqId?: string,
        public readonly reportType?: ReportType,
        public readonly operators?: string[],
        public readonly source?: string,
        public readonly state?: State,
        public readonly startDate?: string,
        public readonly endDate?: string
    ) {}
}
