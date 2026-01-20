import { PaginatedResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface DepartmentsByRegionIdItemApiDto {
    id: string,
    name: string,
    code: string,
    description: string,
    population_size: number,
    municipalities_count: number,
    is_active: boolean,
    created_by: string,
    updated_by: string,
    created_at: string,
    updated_at: string
}

export interface DepartmentsByRegionIdResponseApiDto extends PaginatedResponseDto<DepartmentsByRegionIdItemApiDto> { }
