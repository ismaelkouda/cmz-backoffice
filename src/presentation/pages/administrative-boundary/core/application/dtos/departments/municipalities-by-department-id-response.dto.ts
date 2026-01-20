import { AdministrativeBoundaryDto } from '@shared/data/dtos/administrative-boundary.dto';
import { PaginatedResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface MunicipalitiesByDepartmentIdItemDto {
    id: string,
    name: string,
    code: string,
    description: string,
    region: AdministrativeBoundaryDto;
    populationSize: number,
    isActive: boolean,
    createdBy: string,
    updatedBy: string,
    createdAt: string,
    updatedAt: string
}

export interface MunicipalitiesByDepartmentIdResponseDto extends PaginatedResponseDto<MunicipalitiesByDepartmentIdItemDto> { }
