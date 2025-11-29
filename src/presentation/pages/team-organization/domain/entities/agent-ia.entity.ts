export interface AgentIa {
    readonly id: string;
    readonly code: string;
    readonly nom: string;
    readonly description: string | null;
    readonly statut: string;
    readonly senior_id?: string;
    readonly tenants_count?: number;
    readonly created_at: string;
    readonly updated_at?: string;
}
