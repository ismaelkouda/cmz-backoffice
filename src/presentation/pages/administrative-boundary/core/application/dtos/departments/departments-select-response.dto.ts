import { PaginatedResponseDto } from '@shared/data/dtos/simple-response.dto';
import { MunicipalitiesSelectItemDto } from '../municipalities/municipalities-select-response.dto';

export interface DepartmentsSelectItemDto {
    id: string,
    name: string,
    code: string,
    municipalities: Array<MunicipalitiesSelectItemDto>
}

export interface DepartmentsSelectResponseDto extends PaginatedResponseDto<DepartmentsSelectItemDto> { }
