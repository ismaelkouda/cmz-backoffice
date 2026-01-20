import { PaginatedResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface RegionsItemDto {
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

export interface RegionsResponseDto extends PaginatedResponseDto<RegionsItemDto> { }
