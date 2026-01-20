import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { MunicipalitiesSelectItemApiDto } from '../municipalities/municipalities-select-response-api.dto';

export interface DepartmentsSelectItemApiDto {
    id: string,
    name: string,
    code: string,
    municipalities: MunicipalitiesSelectItemApiDto[]
}

export interface DepartmentsSelectResponseApiDto extends SimpleResponseDto<DepartmentsSelectItemApiDto[]> { }
