import { ReportType } from '@shared/domain/enums/report-type.enum';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export interface AllFilterProps {
    initiatorPhoneNumber?: string;
    uniqId?: string;
    reportType?: ReportType;
    operators?: string[];
    source?: string;
    period?: DatePeriod;
}
