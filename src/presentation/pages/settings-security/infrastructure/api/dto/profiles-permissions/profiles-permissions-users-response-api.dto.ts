import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';

export interface ProfilesPermissionsUsersItemApiDto {
    uniq_id: string;
    email: string;
    phone: string;
    first_name: string;
    last_name: string;
}

export type ProfilesPermissionsUsersResponseApiDto =
    PaginatedResponseDto<ProfilesPermissionsUsersItemApiDto>;
