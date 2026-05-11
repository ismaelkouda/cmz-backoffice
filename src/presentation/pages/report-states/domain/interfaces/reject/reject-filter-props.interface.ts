import { Status } from '@pages/report-states/domain/enums/reject/reject-status.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export interface RejectFilterProps {
    initiatorPhoneNumber?: string;
    uniqId?: string;
    reportType?: ReportType;
    operators?: string[];
    status?: Status;
    source?: string;
    period?: DatePeriod;
}
