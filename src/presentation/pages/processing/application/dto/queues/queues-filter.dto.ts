import { ReportType } from '@shared/domain/enums/report-type.enum';

export interface QueuesFilterDto {
    initiatorPhoneNumber?: string;
    uniqId?: string;
    requestReportUniqId?: string;
    startDate?: string;
    endDate?: string;
    reportType?: ReportType;
    operators?: string[];
    source?: string;
}
