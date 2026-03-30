import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';

export interface AgentsPerformancesItemApiDto {
    id: string;
    name: string;
    goals_size: string;
    achievements_size: string;
    percentages: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type AgentsPerformancesResponseApiDto =
    PaginatedResponseDto<AgentsPerformancesItemApiDto>;
