import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';

export interface AccessLogsItemApiDto {
    id: string;
    action: string;
    source: string;
    used_agent: string;
    created_at: string;
}

export type AccessLogsResponseApiDto =
    PaginatedResponseDto<AccessLogsItemApiDto>;
