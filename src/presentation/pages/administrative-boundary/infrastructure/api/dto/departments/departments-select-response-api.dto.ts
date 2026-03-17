import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { MunicipalitiesSelectItemApiDto } from '../municipalities/municipalities-select-response-api.dto';

export interface DepartmentsSelectItemApiDto {
    id: number;
    name: string;
    code: string;
    municipalities: MunicipalitiesSelectItemApiDto[];
}

export type DepartmentsSelectResponseApiDto = SimpleResponseDto<
    DepartmentsSelectItemApiDto[]
>;
