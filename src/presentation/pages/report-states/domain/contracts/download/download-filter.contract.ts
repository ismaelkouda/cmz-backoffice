import { ReportType } from '@shared/domain/enums/report-type.enum';
import { Status } from '@pages/report-states/domain/enums/download/download-status.enum';

export interface DownloadFilterContract {
    search?: string;
    date?: Date;
    initiatorPhoneNumber?: string;
    uniqId?: string;
    reportType?: ReportType;
    operators?: string[];
    source?: string;
    status?: Status;
    startDate?: Date;
    endDate?: Date;
}
