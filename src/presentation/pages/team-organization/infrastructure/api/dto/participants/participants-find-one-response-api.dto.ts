import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface ParticipantsFindOneItemApiDto {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: string;
    updated_at: string;
}

export type ParticipantsFindOneResponseApiDto =
    SimpleResponseDto<ParticipantsFindOneItemApiDto>;
