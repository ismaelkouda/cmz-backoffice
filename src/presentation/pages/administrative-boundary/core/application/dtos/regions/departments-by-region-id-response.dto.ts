import { PaginatedResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface DepartmentsByRegionIdItemDto {
    id: string,
    name: string,
    code: string,
    description: string,
    populationSize: number,
    municipalitiesCount: number,
    isActive: boolean,
    createdBy: string,
    updatedBy: string,
    createdAt: string,
    updatedAt: string
}

export interface DepartmentsByRegionIdResponseDto extends PaginatedResponseDto<DepartmentsByRegionIdItemDto> { }
