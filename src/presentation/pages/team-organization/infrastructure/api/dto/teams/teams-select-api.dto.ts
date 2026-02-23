import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface TeamsSelectItemApiDto {
    uniq_id: string;
    name: string;
    code: string;
}

export type TeamsSelectResponseApiDto = SimpleResponseDto<
    TeamsSelectItemApiDto[]
>;
