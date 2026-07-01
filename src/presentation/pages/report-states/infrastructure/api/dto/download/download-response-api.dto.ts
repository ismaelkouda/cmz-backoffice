import { ApiStatus } from '@pages/report-states/infrastructure/enums/download/download-status-api.enum';
import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';
import { DownloadTypeDto } from '../download-type-api.dto';

export interface DownloadItemApiDto {
    id: string;
    download_url: string;
    file_name: string;
    file_size: number;
    format: DownloadTypeDto;
    status: ApiStatus;
    filters: { key_label: string; key_value: string }[];
    created_at: string;
}

export type DownloadResponseApiDto = PaginatedResponseDto<DownloadItemApiDto>;
