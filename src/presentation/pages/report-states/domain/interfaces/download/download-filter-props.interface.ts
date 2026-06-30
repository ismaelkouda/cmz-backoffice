import { Status } from '@pages/report-states/domain/enums/download/download-status.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export interface DownloadFilterProps {
    search?: string;
    date?: Date;
    initiatorPhoneNumber?: string;
    uniqId?: string;
    reportType?: ReportType;
    operators?: string[];
    status?: Status;
    source?: string;
    period?: DatePeriod;
}
