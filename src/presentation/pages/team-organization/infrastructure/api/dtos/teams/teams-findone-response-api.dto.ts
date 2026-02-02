import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface TeamsFindOneItemApiDto {
    id?: string;
    code?: string;
    name?: string;
    description?: string;
}

export type TeamsFindOneResponseApiDto =
    SimpleResponseDto<TeamsFindOneItemApiDto>;
