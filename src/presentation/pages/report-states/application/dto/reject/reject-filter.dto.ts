import { Status } from '@pages/report-states/domain/enums/reject/reject-status.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';

export interface RejectFilterDto {
    initiatorPhoneNumber?: string;
    uniqId?: string;
    reportType?: ReportType;
    operators?: string[];
    source?: string;
    status?: Status;
    startDate?: string;
    endDate?: string;
}
