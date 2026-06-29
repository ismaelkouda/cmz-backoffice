import { ReportType } from '@shared/domain/enums/report-type.enum';

export interface CloseFilterDto {
    initiatorPhoneNumber?: string;
    uniqId?: string;
    startDate?: Date;
    endDate?: Date;
    reportType?: ReportType;
    operators?: string[];
    source?: string;
}
