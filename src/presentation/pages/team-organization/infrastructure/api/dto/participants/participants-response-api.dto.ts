import { StatusDto } from '@pages/team-organization/infrastructure/api/dto/participants/participants-status-api.dto';
import { RolesDto } from '@shared/data/dto/roles.dto';
import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';

export interface ParticipantsItemApiDto {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: RolesDto | null;
    status: StatusDto;
    created_at: string;
    updated_at: string;
}

export type ParticipantsResponseApiDto =
    PaginatedResponseDto<ParticipantsItemApiDto>;
