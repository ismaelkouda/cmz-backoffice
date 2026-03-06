import { RolesDto } from '@shared/data/dto/roles.dto';
import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';

import { StatusDto } from './participants-status-api.dto';

export interface ParticipantsItemApiDto {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: RolesDto;
    status: StatusDto;
    created_at: string;
    updated_at: string;
}

export type ParticipantsResponseApiDto =
    PaginatedResponseDto<ParticipantsItemApiDto>;
