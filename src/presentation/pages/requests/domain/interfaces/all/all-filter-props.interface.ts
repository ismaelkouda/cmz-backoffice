import { Status } from '@pages/requests/domain/enums/all/all-status.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';
export interface AllFilterProps {
    initiatorPhoneNumber?: string;
    uniqId?: string;
    reportType?: ReportType;
    operators?: string[];
    status?: Status;
    source?: string;
    period?: DatePeriod;
}
