import { AdministrativeBoundaryDto } from '@shared/data/dtos/administrative-boundary.dto';
import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface DepartmentsFindoneItemApiDto {
    id: string,
    name: string,
    code: string,
    description: string,
    region: AdministrativeBoundaryDto,
    population_size: number,
    municipalities_count: number,
    is_active: boolean,
    created_by: string,
    updated_by: string,
    created_at: string,
    updated_at: string
}

export interface DepartmentsFindoneResponseApiDto extends SimpleResponseDto<DepartmentsFindoneItemApiDto> { }
