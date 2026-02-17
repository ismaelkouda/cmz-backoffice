import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';

export interface ProfilesPermissionsItemApiDto {
    uniq_id: string;
    name: string;
    slug: string;
    description: string;
    users_count: string;
    is_active: boolean;
    created_at: string;
}

export type ProfilesPermissionsResponseApiDto =
    PaginatedResponseDto<ProfilesPermissionsItemApiDto>;
