export interface ApiResponseUsageInterface {
    error: boolean;
    message: string;
    data: Array<UsageInterface>;
}

export interface UsageInterface {
    id: number;
    nom_usage: string;
    slug: string;
    description: string;
    statut: string;
    created_at: string; // Peut être transformé en Date si nécessaire
    updated_at: string; // Peut être transformé en Date si nécessaire
}
