import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface ParticipantsSelectItemApiDto {
    id: string;
    first_name: string;
    last_name: string;
}

export type ParticipantsSelectResponseApiDto = SimpleResponseDto<
    ParticipantsSelectItemApiDto[]
>;
