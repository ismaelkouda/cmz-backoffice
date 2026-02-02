import { PaginatedResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface AgentsPerformancesItemApiDto {
    id: string;
    name: string;
    goals_size: string;
    achievements_size: string;
    percentages: string;
    is_active: boolean;
    created_at: string;
}

export type AgentsPerformancesResponseApiDto =
    PaginatedResponseDto<AgentsPerformancesItemApiDto>;
