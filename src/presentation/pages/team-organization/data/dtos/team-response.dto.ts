export interface TeamItemDto {
    id: string;
    code: string;
    nom: string;
    description: string | null;
    statut: string;
    tenants_count: number;
    agents_count: number;
    created_at: string;
    updated_at?: string;
}

export interface TeamResponseDto {
    error: boolean;
    message: string;
    data: TeamItemDto[];
}

export interface TeamStoreRequestDto {
    code?: string;
    nom: string;
    description?: string;
}

export interface TeamUpdateRequestDto {
    equipe_id: string;
    nom: string;
    description?: string;
}

export interface TeamDeleteResponseDto {
    error: boolean;
    message: string;
    data?: unknown;
}

export interface TeamEnableResponseDto {
    error: boolean;
    message: string;
    data?: unknown;
}

export interface TeamDisableResponseDto {
    error: boolean;
    message: string;
    data?: unknown;
}

export interface TenantLibreDto {
    id: string;
    code: string;
    nom_tenant: string;
}

export interface TenantItemDto {
    id: string;
    code: string;
    nom_tenant: string;
    compte_client?: string;
    segment_client?: string;
    domaine_activite?: string;
    statut: string;
    created_at?: string;
    updated_at?: string;
}

export interface TenantResponseDto {
    error: boolean;
    message: string;
    data: TenantItemDto[];
}

export interface ParticipantLibreDto {
    id: string;
    matricule: string;
    nom: string;
    prenoms: string;
    role: string;
}

export interface ParticipantAffectedItemDto {
    id: string;
    matricule: string;
    nom: string;
    prenoms: string;
    username: string;
    email: string;
    contacts: string;
    role: string;
    statut: string;
    created_at?: string;
    updated_at?: string;
}

export interface ParticipantAffectedResponseDto {
    error: boolean;
    message: string;
    data: ParticipantAffectedItemDto[];
}

export interface AssignRequestDto {
    equipe_id: string;
    tenant_ids?: string[];
    participant_ids?: string[];
}

export interface ReassignRequestDto {
    equipe_id: string;
    new_equipe_id?: string;
    tenant_ids?: string[];
    participant_ids?: string[];
}

export interface RemoveRequestDto {
    equipe_id: string;
    tenant_ids?: string[];
    participant_ids?: string[];
}

