export interface ParticipantItemDto {
    id: string;
    matricule: string;
    nom: string;
    prenoms: string;
    username: string;
    email: string;
    contacts: string;
    adresse: string | null;
    role: string;
    statut: string;
    created_at?: string;
    updated_at?: string;
}

export interface ParticipantResponseDto {
    error: boolean;
    message: string;
    data: ParticipantItemDto[];
}

export interface ParticipantStoreRequestDto {
    nom: string;
    prenoms: string;
    username: string;
    email: string;
    contacts: string;
    adresse?: string;
    role: string;
}

export interface ParticipantUpdateRequestDto {
    participant_id: string;
    nom: string;
    prenoms: string;
    email: string;
    contacts: string;
    adresse?: string;
    role: string;
}

export interface ParticipantDeleteResponseDto {
    error: boolean;
    message: string;
    data?: unknown;
}

export interface ParticipantEnableResponseDto {
    error: boolean;
    message: string;
    data?: unknown;
}

export interface ParticipantDisableResponseDto {
    error: boolean;
    message: string;
    data?: unknown;
}

export interface RoleDto {
    id: string;
    name: string;
    label?: string;
}

export interface RolesResponseDto {
    error: boolean;
    message: string;
    data: RoleDto[];
}

