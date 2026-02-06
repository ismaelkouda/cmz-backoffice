import { PaginatedResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface TeamsParticipantsItemApiDto {
    id: string;
    matricule: string;
    email: string;
    phone: string;
    first_name: string;
    last_name: string;
    role: string;
    is_active: boolean;
}

export type TeamsParticipantsResponseApiDto =
    PaginatedResponseDto<TeamsParticipantsItemApiDto>;
