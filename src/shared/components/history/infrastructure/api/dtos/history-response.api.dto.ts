import { PaginatedResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface HistoryItemApiDto {
    id: string;
    action_type: string;
    action: string;
    source: string;
    created_at: string;
}

export type HistoryResponseApiDto = PaginatedResponseDto<HistoryItemApiDto>;
