import { ReportType } from '@shared/domain/enums/report-type.enum';

export interface CloseFilterContract {
    initiatorPhoneNumber?: string;
    uniqId?: string;
    requestReportUniqId?: string;
    startDate?: Date;
    endDate?: Date;
    reportType?: ReportType;
    operators?: string[];
    source?: string;
}
