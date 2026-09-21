import { ReportType } from '@shared/domain/enums/report-type.enum';

export interface AllFilterDto {
    initiatorPhoneNumber?: string;
    uniqId?: string;
    requestReportUniqId?: string;
    reportType?: ReportType;
    operators?: string[];
    source?: string;
    startDate?: Date;
    endDate?: Date;
}
