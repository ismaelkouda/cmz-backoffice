import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';

export interface ProfilesPermissionsItemApiDto {
    uniq_id: string;
    name: string;
    slug: string;
    description: string;
    total_users: string;
    status: boolean;
    created_at: string;
    updated_at: string;
}

export type ProfilesPermissionsResponseApiDto =
    PaginatedResponseDto<ProfilesPermissionsItemApiDto>;
