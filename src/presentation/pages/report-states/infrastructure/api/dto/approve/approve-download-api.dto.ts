import { DownloadSource } from '@presentation/pages/report-states/domain/enums/download-source.enum';
import { DownloadTypeDto } from '@pages/report-states/infrastructure/api/dto/download-type-api.dto';

export interface ApproveDownloadApiDto {
    entity_type: DownloadSource;
    format: DownloadTypeDto;
    initiator_phone_number?: string;
    uniq_id?: string;
    report_type?: string;
    operators?: string[];
    source?: string;
    start_date?: Date;
    end_date?: Date;
}
