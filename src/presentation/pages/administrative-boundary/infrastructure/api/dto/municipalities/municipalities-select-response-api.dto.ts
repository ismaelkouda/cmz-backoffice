import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface MunicipalitiesSelectItemApiDto {
    id: string;
    name: string;
    code: string;
    updated_at: string;
}

export type MunicipalitiesSelectResponseApiDto = SimpleResponseDto<
    MunicipalitiesSelectItemApiDto[]
>;
