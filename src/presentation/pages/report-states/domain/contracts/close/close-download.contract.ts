import { ReportType } from '@shared/domain/enums/report-type.enum';
import { DownloadType } from '@presentation/pages/report-states/domain/enums/download-type.enum';
import { DownloadSource } from '@presentation/pages/report-states/domain/enums/download-source.enum';

export interface CloseDownloadContract {
    metaData: {
        source: DownloadSource;
    };
    format: DownloadType;
    initiatorPhoneNumber?: string;
    uniqId?: string;
    startDate?: Date;
    endDate?: Date;
    reportType?: ReportType;
    operators?: string[];
    source?: string;
}
