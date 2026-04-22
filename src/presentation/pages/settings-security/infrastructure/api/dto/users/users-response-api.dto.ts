import { StatusDto } from '@pages/settings-security/infrastructure/api/dto/users/users-status-api.dto';
import { RolesDto } from '@shared/data/dto/roles.dto';
import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';

export interface UsersItemApiDto {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    profile: string;
    role: RolesDto;
    status: StatusDto;
    created_at: string;
    updated_at: string;
}

export type UsersResponseApiDto = PaginatedResponseDto<UsersItemApiDto>;
