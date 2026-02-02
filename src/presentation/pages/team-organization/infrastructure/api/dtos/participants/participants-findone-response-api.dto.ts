import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface ParticipantsFindOneItemApiDto {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: {
        code: string;
        name: string;
    };
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export type ParticipantsFindOneResponseApiDto =
    SimpleResponseDto<ParticipantsFindOneItemApiDto>;
