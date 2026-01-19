import { AdministrativeBoundaryDto } from '@shared/data/dtos/administrative-boundary.dto';
import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface MunicipalitiesFindoneItemApiDto {
    id: string,
    name: string,
    code: string,
    description: string,
    region: AdministrativeBoundaryDto,
    department: AdministrativeBoundaryDto,
    population_size: number,
    is_active: boolean,
    created_by: string,
    updated_by: string,
    created_at: string,
    updated_at: string
}

export interface MunicipalitiesFindoneResponseApiDto extends SimpleResponseDto<MunicipalitiesFindoneItemApiDto> { }
