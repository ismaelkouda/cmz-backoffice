import { PaginatedResponseDto } from "@shared/data/dtos/simple-response.dto";

export interface AccessLogsItemDto {
    id: string;
    action: string;
    source: string;
    usedAgent: string;
    createdAt: string;
}

export interface AccessLogsResponseDto extends PaginatedResponseDto<AccessLogsItemDto> { }