import { ReportType } from '@shared/domain/enums/report-type.enum';
import { Status } from '@pages/report-states/domain/enums/reject/reject-status.enum';
import { DownloadType } from '@presentation/pages/report-states/domain/enums/download-type.enum';
import { DownloadSource } from '@presentation/pages/report-states/domain/enums/download-source.enum';

export interface RejectDownloadContract {
    metaData: {
        source: DownloadSource;
    };
    format: DownloadType;
    initiatorPhoneNumber?: string;
    uniqId?: string;
    reportType?: ReportType;
    operators?: string[];
    source?: string;
    status?: Status;
    startDate?: Date;
    endDate?: Date;
}
