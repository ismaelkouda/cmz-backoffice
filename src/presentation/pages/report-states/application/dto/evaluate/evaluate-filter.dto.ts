import { ReportType } from '@shared/domain/enums/report-type.enum';

export interface EvaluateFilterDto {
    initiatorPhoneNumber?: string;
    uniqId?: string;
    startDate?: string;
    endDate?: string;
    reportType?: ReportType;
    operators?: string[];
    source?: string;
}
