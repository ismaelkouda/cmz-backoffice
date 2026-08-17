import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';

export interface ProfilesPermissionsFreeUsersItemApiDto {
    uniq_id: string;
    email: string;
    phone: string;
    first_name: string;
    last_name: string;
    updated_at: string;
}

export type ProfilesPermissionsFreeUsersResponseApiDto =
    PaginatedResponseDto<ProfilesPermissionsFreeUsersItemApiDto>;
