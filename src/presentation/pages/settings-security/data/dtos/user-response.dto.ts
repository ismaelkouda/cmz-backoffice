import { Paginate } from '@shared/interfaces/paginate';

export interface UserItemDto {
    id: string;
    matricule: string;
    lastName: string;
    firstName: string;
    fullName?: string;
    email: string;
    uniqId: string; // profil Utilisateur
    profile?: string; // nom du profil
    status: string; // statut (active/inactive)
    created_at?: string;
    updated_at?: string;
}

export interface UserResponseDto {
    error: boolean;
    message: string;
    data: Paginate<UserItemDto>;
}

export interface UserStoreRequestDto {
    lastName: string;
    firstName: string;
    uniqId: string;
    matricule: string;
    email: string;
}

export interface UserUpdateRequestDto {
    id: string;
    lastName: string;
    firstName: string;
    uniqId: string;
    matricule: string;
    email: string;
}

export interface UserDeleteResponseDto {
    error: boolean;
    message: string;
    data?: unknown;
}

export interface UserEnableResponseDto {
    error: boolean;
    message: string;
    data?: unknown;
}

export interface UserDisableResponseDto {
    error: boolean;
    message: string;
    data?: unknown;
}
