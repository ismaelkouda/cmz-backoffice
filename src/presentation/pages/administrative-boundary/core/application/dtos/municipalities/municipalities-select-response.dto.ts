import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface MunicipalitiesSelectItemDto {
    id: string,
    name: string,
    code: string,
}

export interface MunicipalitiesSelectResponseDto extends SimpleResponseDto<MunicipalitiesSelectItemDto> { }
