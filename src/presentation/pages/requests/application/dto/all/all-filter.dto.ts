import { Status } from '@pages/requests/domain/enums/all/all-status.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';

export interface AllFilterDto {
    initiatorPhoneNumber?: string;
    uniqId?: string;
    reportType?: ReportType;
    operators?: string[];
    source?: string;
    status?: Status;
    startDate?: string;
    endDate?: string;
}
