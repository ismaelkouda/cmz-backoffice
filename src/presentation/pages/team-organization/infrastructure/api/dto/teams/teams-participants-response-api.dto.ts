import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';

export interface TeamsParticipantsItemApiDto {
    id: string;
    matricule: string;
    email: string;
    phone: string;
    first_name: string;
    last_name: string;
    role: string;
    is_active: boolean;
    updated_at: string;
}

export type TeamsParticipantsResponseApiDto =
    PaginatedResponseDto<TeamsParticipantsItemApiDto>;
