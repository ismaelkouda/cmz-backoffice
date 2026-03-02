import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';

export interface DepartmentsByRegionIdItemApiDto {
    id: string;
    name: string;
    code: string;
    description: string;
    population_size: number;
    municipalities_count: number;
    status: string;
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
}

export type DepartmentsByRegionIdResponseApiDto =
    PaginatedResponseDto<DepartmentsByRegionIdItemApiDto>;
