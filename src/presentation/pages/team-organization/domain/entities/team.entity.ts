export interface Team {
    readonly id: string;
    readonly code: string;
    readonly nom: string;
    readonly description: string | null;
    readonly statut: string; // actif/inactif
    readonly tenants_count: number;
    readonly agents_count: number;
    readonly created_at: string;
    readonly updated_at?: string;
}
