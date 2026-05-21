import { AdministrativeBoundaryDto } from '@shared/data/dto/administrative-boundary.dto';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface DepartmentsFindOneItemApiDto {
    id: string;
    name: string;
    code: string;
    description: string;
    region_id: string;
    region_code: string;
    region: AdministrativeBoundaryDto;
    population_size: number;
    municipalities_count: number;
    is_active: boolean;
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
}

export type DepartmentsFindOneResponseApiDto =
    SimpleResponseDto<DepartmentsFindOneItemApiDto>;
