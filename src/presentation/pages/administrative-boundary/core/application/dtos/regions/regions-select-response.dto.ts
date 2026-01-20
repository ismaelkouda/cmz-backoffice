import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { DepartmentsSelectItemDto } from '../departments/departments-select-response.dto';

export interface RegionsSelectItemDto {
    id: string,
    name: string,
    code: string,
    departments: Array<DepartmentsSelectItemDto>,
}

export interface RegionsSelectResponseDto extends SimpleResponseDto<RegionsSelectItemDto> { }
