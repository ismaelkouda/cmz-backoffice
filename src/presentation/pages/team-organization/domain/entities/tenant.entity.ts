export interface Tenant {
    readonly id: string;
    readonly code: string;
    readonly nom_tenant: string;
    readonly compte_client?: string;
    readonly segment_client?: string;
    readonly domaine_activite?: string;
    readonly statut: string; // actif/inactif/affecté
    readonly created_at?: string;
    readonly updated_at?: string;
}

