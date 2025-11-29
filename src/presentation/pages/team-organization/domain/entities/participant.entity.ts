export interface Participant {
    readonly id: string;
    readonly matricule: string;
    readonly nom: string;
    readonly prenoms: string;
    readonly username: string;
    readonly email: string;
    readonly contacts: string;
    readonly adresse: string | null;
    readonly role: string;
    readonly statut: string; // actif/inactif/affecté
    readonly created_at?: string;
    readonly updated_at?: string;
}
