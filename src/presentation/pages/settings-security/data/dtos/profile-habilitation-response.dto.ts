import { Paginate } from '@shared/interfaces/paginate';

export interface ProfileHabilitationItemDto {
    id: string;
    name: string;
    description: string;
    status: string;
    users_count: number;
    totalUsers?: number;
    created_at: string;
    createdAt?: string;
    updated_at?: string;
}

export interface ProfileHabilitationResponseDto {
    error: boolean;
    message: string;
    data: Paginate<ProfileHabilitationItemDto>;
}

export interface ProfileHabilitationStoreRequestDto {
    name: string;
    description: string;
}

export interface ProfileHabilitationUpdateRequestDto {
    id: string;
    name: string;
    description: string;
}

export interface ProfileHabilitationDeleteResponseDto {
    error: boolean;
    message: string;
    data?: unknown;
}

export interface ProfileHabilitationEnableResponseDto {
    error: boolean;
    message: string;
    data?: unknown;
}

export interface ProfileHabilitationDisableResponseDto {
    error: boolean;
    message: string;
    data?: unknown;
}

export interface ProfileWithoutUserDto {
    id: string;
    name: string;
    description?: string;
}

export interface ReassignRequestDto {
    profileId: string;
    newProfileId: string;
    userIds: string[];
}

export interface RemoveRequestDto {
    profileId: string;
    userIds: string[];
}

export interface AffectedRequestDto {
    profileId: string;
    userIds: string[];
}
