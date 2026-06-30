import { ApiStatus } from '@pages/report-states/infrastructure/enums/download/download-status-api.enum';

export interface DownloadFilterApiDto {
    search?: string;
    date?: string;
    initiator_phone_number?: string;
    uniq_id?: string;
    report_type?: string;
    operators?: string[];
    source?: string;
    status?: ApiStatus;
    start_date?: string;
    end_date?: string;
}
