import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface TeamsSelectItemApiDto {
    id: string;
    name: string;
    code: string;
}

export type TeamsSelectResponseApiDto = SimpleResponseDto<
    TeamsSelectItemApiDto[]
>;
