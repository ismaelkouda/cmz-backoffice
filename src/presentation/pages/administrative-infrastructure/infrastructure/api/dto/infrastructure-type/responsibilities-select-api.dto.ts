import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface ResponsibilitiesSelectItemApiDto {
    id: string;
    name: string;
    code: string;
}

export type ResponsibilitiesSelectResponseApiDto = SimpleResponseDto<
    ResponsibilitiesSelectItemApiDto[]
>;
