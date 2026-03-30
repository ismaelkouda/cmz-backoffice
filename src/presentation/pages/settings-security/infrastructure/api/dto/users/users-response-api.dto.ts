import { StatusDto } from '@pages/settings-security/infrastructure/api/dto/users/users-status-api.dto';
import { ProfilesDto } from '@shared/data/dto/profiles.dto';
import { ResponsibilitiesDto } from '@shared/data/dto/responsibilities.dto';
import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';

export interface UsersItemApiDto {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    profile: ProfilesDto;
    responsibility: ResponsibilitiesDto;
    status: StatusDto;
    created_at: string;
    updated_at: string;
}

export type UsersResponseApiDto = PaginatedResponseDto<UsersItemApiDto>;
