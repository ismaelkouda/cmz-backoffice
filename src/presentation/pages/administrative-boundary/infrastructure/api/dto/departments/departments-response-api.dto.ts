import { AdministrativeBoundaryDto } from '@shared/data/dto/administrative-boundary.dto';
import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';

export interface DepartmentsItemApiDto {
    id: string;
    name: string;
    code: string;
    description: string;
    region: AdministrativeBoundaryDto;
    population_size: number;
    municipalities_count: number;
    infrastructure_size: number;
    is_active: boolean;
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
}

export type DepartmentsResponseApiDto =
    PaginatedResponseDto<DepartmentsItemApiDto>;
