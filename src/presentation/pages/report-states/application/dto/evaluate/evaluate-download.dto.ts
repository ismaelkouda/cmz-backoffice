import { DownloadType } from '@presentation/pages/report-states/domain/enums/download-type.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';

export interface EvaluateDownloadDto {
    format: DownloadType;
    initiatorPhoneNumber?: string;
    uniqId?: string;
    startDate?: Date;
    endDate?: Date;
    reportType?: ReportType;
    operators?: string[];
    source?: string;
}
