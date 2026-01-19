import { PaginatedResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface RegionsFindOneItemDto {
    id: string,
    name: string,
    code: string,
    description: string,
    populationSize: number,
    departmentsCount: number,
    municipalitiesCount: number,
    isActive: boolean,
    createdBy: string,
    updatedBy: string,
    createdAt: string,
    updatedAt: string
}

export interface RegionsFindOneResponseDto extends PaginatedResponseDto<RegionsFindOneItemDto> { }
