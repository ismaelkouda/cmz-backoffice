import { PaginatedResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface AccessLogsItemDto {
    id: string;
    created_at: string;
    event: string;
    action: string;
    ip: string;
    data: string;
}

export type AccessLogsResponseDto = PaginatedResponseDto<AccessLogsItemDto>;
