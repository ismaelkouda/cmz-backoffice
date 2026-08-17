import { DownloadType } from '@presentation/pages/report-states/domain/enums/download-type.enum';
import { Status } from '@presentation/pages/report-states/domain/enums/reject/reject-status.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';

export class RejectDownloadQuery {
    constructor(
        public readonly format: DownloadType,
        public readonly initiatorPhoneNumber?: string,
        public readonly uniqId?: string,
        public readonly reportType?: ReportType,
        public readonly operators?: string[],
        public readonly source?: string,
        public readonly status?: Status,
        public readonly startDate?: Date,
        public readonly endDate?: Date
    ) {}
}
