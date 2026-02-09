import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface ParticipantsFindOneItemApiDto {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: string;
}

export type ParticipantsFindOneResponseApiDto =
    SimpleResponseDto<ParticipantsFindOneItemApiDto>;
