import { PaginatedResponseDto } from "@shared/data/dtos/simple-response.dto";

export interface AccessLogsItemApiDto {
    id: string;
    action: string;
    source: string;
    used_agent: string;
    created_at: string;
}

export interface AccessLogsResponseApiDto extends PaginatedResponseDto<AccessLogsItemApiDto> { }