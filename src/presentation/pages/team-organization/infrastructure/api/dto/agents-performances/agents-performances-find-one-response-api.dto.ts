import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';

export interface AgentsPerformancesFindOneItemApiDto {
    uniq_id: string;
    report_type: string;
    operators: string;
    source: string;
    initiator_phone_number: string;
    created_at: string;
    updated_at: string;
}

export type AgentsPerformancesFindOneResponseApiDto =
    PaginatedResponseDto<AgentsPerformancesFindOneItemApiDto>;
