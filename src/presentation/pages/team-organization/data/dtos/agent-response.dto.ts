export interface AgentItemDto {
    id: string;
    code: string;
    nom: string;
    description: string | null;
    statut: string;
    senior_id?: string;
    tenants_count?: number;
    created_at: string;
    updated_at?: string;
}

export interface AgentResponseDto {
    error: boolean;
    message: string;
    data: AgentItemDto[];
}

export interface AgentStoreRequestDto {
    code?: string;
    nom: string;
    description?: string;
}

export interface AgentUpdateRequestDto {
    agent_ia_id: string;
    nom: string;
    description?: string;
}

export interface AgentDeleteResponseDto {
    error: boolean;
    message: string;
    data?: unknown;
}

export interface AgentEnableResponseDto {
    error: boolean;
    message: string;
    data?: unknown;
}

export interface AgentDisableResponseDto {
    error: boolean;
    message: string;
    data?: unknown;
}

export interface TenantLibreDto {
    id: string;
    code: string;
    nom_tenant: string;
}

export interface AssignRequestDto {
    agent_ia_id: string;
    tenant_ids?: string[];
}

export interface ReassignRequestDto {
    agent_ia_id: string;
    new_agent_ia_id?: string;
    tenant_ids?: string[];
}

export interface RemoveRequestDto {
    agent_ia_id: string;
    tenant_ids?: string[];
}
