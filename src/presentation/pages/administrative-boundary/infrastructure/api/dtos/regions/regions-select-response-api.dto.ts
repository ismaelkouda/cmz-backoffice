import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { DepartmentsSelectItemApiDto } from '../departments/departments-select-response-api.dto';

export interface RegionsSelectItemApiDto {
    id: string,
    name: string,
    code: string,
    departments: DepartmentsSelectItemApiDto[],
}

export interface RegionsSelectResponseApiDto extends SimpleResponseDto<RegionsSelectItemApiDto[]> { }
