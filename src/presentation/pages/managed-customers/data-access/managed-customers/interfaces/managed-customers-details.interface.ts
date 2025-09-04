export interface ManagedCustomersDetailsApiResponseInterface {
    error: boolean;
    message: string;
    data: ManagedCustomersDetailsInterface;
}

export interface ManagedCustomersDetailsInterface {
    id: number;
    code_client: string;
    nom_client: string;
    logo_client: string;
    slug: string;
    domaine_activite: string;
    email_diffusion: string | null;
    email_diffusion_client: string | null;
    url_detection_appro: string | null;
    nom_admin_client: string | null;
    contact_admin_client: string | null;
    email_admin_client: string;
    nom_gestionnaire: string | null;
    contact_gestionnnaire: string | null;
    email_gestionnnaire: string | null;
    gestionnaire_client_id: number | null;
    escalade_client_id: number | null;
    nom_commercial: string | null;
    contact_commercial: string | null;
    email_commercial: string | null;
    nom_senior_manager: string | null;
    contact_senior_manager: string | null;
    email_senior_manager: string | null;
    description: string;
    url_frontend: string | null;
    suffixe_email: string | null;
    compte_client: string;
    segment_client: string | null;
    forme_juridique_code: string;
    regime_code: string | null;
    adresse: string;
    numero_rccm: string;
    fichier_rccm: string | null;
    fichier_dfe: string | null;
    numero_cc: string;
    centre: string;
    nom_gerant: string;
    contact_gerant: string;
    email_gerant: string;
    piece_gerant: string | null;
    type_entreprise: string | null;
    username: string;
    password: string;
    lien_client: string | null;
    fichier_formation: string | null;
    statut: string;
    created_at: string;
    updated_at: string;
}
