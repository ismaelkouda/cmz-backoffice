import { RolesDto } from '@shared/data/dto/roles.dto';
import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';

export interface TeamsParticipantsItemApiDto {
    id: string;
    email: string;
    phone: string;
    first_name: string;
    last_name: string;
    role: RolesDto;
    updated_at: string;
}

export type TeamsParticipantsResponseApiDto =
    PaginatedResponseDto<TeamsParticipantsItemApiDto>;
