export interface ProfilApplicantInterface {
    id: number;
    nom: string;
    slug: string;
    description: string;
    mode_lecture: boolean;
    statut: string;
    created_at: string;
    updated_at: string;
}

export interface ApplicantInterface {
    id: string;
    matricule: string;
    profil_user_id: number;
    nom: string;
    prenoms: string;
    username: string;
    adresse: string | null;
    contacts: string | null;
    email: string;
    profil_slug: string | null;
    email_verified_at: string | null;
    statut: string;
    created_at: string;
    updated_at: string;
    nom_complet: string;
    profil_user: ProfilApplicantInterface;
    tenant: Tenant;
}

export interface ApiResponseApplicantInterface {
    error: boolean;
    message: string;
    data: ApplicantInterface[];
}

export interface Tenant {
    id: number;
    tenant_code: string;
    nom_tenant: string;
    fullName: string;
    slug: string;
    domaine_activite: string;
    email_diffusion: string;
    email_diffusion_tenant: string;
    url_detection_appro: string | null;
    intervenant_id: number | null;
    nom_admin_tenant: string;
    contact_admin_tenant: string;
    email_admin_tenant: string;
    nom_gestionnaire: string;
    contact_gestionnnaire: string;
    email_gestionnnaire: string;
    gestionnaire_tenant_id: number | null;
    escalade_tenant_id: number | null;
    commercial_id: number | null;
    nom_commercial: string | null;
    contact_commercial: string | null;
    email_commercial: string | null;
    senior_manager_id: number | null;
    nom_senior_manager: string | null;
    contact_senior_manager: string | null;
    email_senior_manager: string | null;
    description: string;
    url_backend: string | null;
    url_minio: string;
    url_nodered: string | null;
    url_deploy_profil_supervision: string | null;
    url_frontend: string | null;
    url_demandes_sla: string | null;
    url_dossiers_demandes: string | null;
    url_systeme_paiement: string | null;
    ws_server: string | null;
    nb_max_users: number;
    lien_dashboard_grafana: string | null;
    lien_dashboard_appro: string | null;
    lien_dashboard_rejets: string | null;
    logo_tenant: string;
    application: string;
    suffixe_email: string;
    url_consommation: string | null;
    compte_client: string;
    segment_client: string | null;
    forme_juridique_code: string | null;
    regime_code: string | null;
    adresse: string;
    numero_rccm: string;
    forme_juridique: string;
    nom_gerant: string;
    fichier_rccm: string;
    numero_cc: string;
    regime: string;
    centre: string;
    fichier_dfe: string;
    admin_tenant_id: number | null;
    contact_gerant: string | null;
    email_gerant: string | null;
    piece_gerant: string | null;
    created_at: string;
    updated_at: string;
}
