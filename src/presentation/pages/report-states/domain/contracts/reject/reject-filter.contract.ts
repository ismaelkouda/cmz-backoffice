import { ReportType } from '@shared/domain/enums/report-type.enum';
import { Status } from '@pages/report-states/domain/enums/reject/reject-status.enum';

export interface RejectFilterContract {
    initiatorPhoneNumber?: string;
    uniqId?: string;
    reportType?: ReportType;
    operators?: string[];
    source?: string;
    status?: Status;
    startDate?: Date;
    endDate?: Date;
}
