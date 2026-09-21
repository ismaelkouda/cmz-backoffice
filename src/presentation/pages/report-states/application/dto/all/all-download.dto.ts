import { DownloadType } from '@presentation/pages/report-states/domain/enums/download-type.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';

export interface AllDownloadDto {
    format: DownloadType;
    initiatorPhoneNumber?: string;
    uniqId?: string;
    requestReportUniqId?: string;
    reportType?: ReportType;
    operators?: string[];
    source?: string;
    startDate?: Date;
    endDate?: Date;
}
