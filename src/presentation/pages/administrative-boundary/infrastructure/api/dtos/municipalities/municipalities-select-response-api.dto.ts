import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface MunicipalitiesSelectItemApiDto {
    id: string,
    name: string,
    code: string,
}

export interface MunicipalitiesSelectResponseApiDto extends SimpleResponseDto<MunicipalitiesSelectItemApiDto> { }
