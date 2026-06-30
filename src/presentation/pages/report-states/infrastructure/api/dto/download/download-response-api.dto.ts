import { ApiStatus } from '@pages/report-states/infrastructure/enums/download/download-status-api.enum';
import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';
import { DownloadTypeDto } from '../download-type-api.dto';

export interface DownloadItemApiDto {
    uniq_id: string;
    date: string;
    name: string;
    type: DownloadTypeDto;
    size: number;
    status: ApiStatus;
    filter: { name: string; value: string }[];
    updated_at: string;
}

export type DownloadResponseApiDto = PaginatedResponseDto<DownloadItemApiDto>;
