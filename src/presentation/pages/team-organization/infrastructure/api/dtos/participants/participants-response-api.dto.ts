import { ActionDropdownDto } from '@shared/data/dtos/action-dropdown.dto';
import { RolesDto } from '@shared/data/dtos/roles.dto';
import { PaginatedResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface ParticipantsItemApiDto {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: RolesDto;
    status: ActionDropdownDto;
    created_at: string;
    updated_at: string;
}

export type ParticipantsResponseApiDto =
    PaginatedResponseDto<ParticipantsItemApiDto>;
