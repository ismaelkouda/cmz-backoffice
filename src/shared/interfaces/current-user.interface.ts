export interface Permission {
    id: number;
    level: number;
    title: string;
    label: string;
    data: string;
    headCode: string;
    icon: string;
    path?: string;
    type: 'link' | 'sub';
    active?: boolean;
    expanded?: boolean;
    statut?: boolean;
    children?: Permission[];
  }
  
  export interface ProfilCurrentUser {
    id: number;
    nom: string;
    slug: string;
    description: string;
    mode_lecture: boolean;
    statut: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface Tenant {
    id: number;
    tenant_code: string;
    nom_tenant: string;
    slug: string;
    domaine_activite: string;
    intervenant_id: number | null;
    nom_admin_tenant: string;
    contact_admin_tenant: string;
    email_admin_tenant: string;
    nom_gestionnaire: string;
    contact_gestionnnaire: string;
    email_gestionnnaire: string;
    description: string;
    url_backend: string;
    url_minio: string;
    url_nodered: string;
    url_deploy_profil_supervision: string;
    url_frontend: string;
    url_demandes_sla: string;
    ws_server: string;
    nb_max_users: number;
    lien_dashboard_grafana: string;
    lien_dashboard_appro: string;
    lien_dashboard_rejets: string;
    logo_tenant: string;
    application: string;
    suffixe_email: string;
    created_at: string;
    updated_at: string;
    commercial_id: number | null;
    nom_commercial: string | null;
    contact_commercial: string | null;
    email_commercial: string | null;
    email_diffusion: string;
    senior_manager_id: number | null;
    nom_senior_manager: string | null;
    contact_senior_manager: string | null;
    email_senior_manager: string | null;
    gestionnaire_tenant_id: number | null;
    escalade_tenant_id: number | null;
    email_diffusion_tenant: string;
    url_detection_appro: string;
    url_consommation: string;
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
  }
  
  export interface StructureOrganisationnelle {
    id: number;
    uuid: string;
    niveau_1: string;
    niveau_2: string;
    niveau_3: string;
    nom_affichage_niveau_1: string;
    nom_affichage_niveau_2: string;
    nom_affichage_niveau_3: string;
    niveau_1_menu: string;
    niveau_2_menu: string;
    niveau_3_menu: string;
    description: string | null;
    created_at: string;
    updated_at: string;
  }
  
  export interface CurrentUser {
    id: number;
    matricule: string;
    profil_user_id: number;
    nom: string;
    prenoms: string;
    username: string;
    adresse: string;
    contacts: string;
    email: string;
    profil_slug: string;
    email_verified_at: string | null;
    statut: string;
    profil_user: ProfilCurrentUser;
    permissions: Permission[];
    habilitationsNiveauUn: string[];
    habilitationsNiveauDeux: string[];
    habilitationsNiveauTrois: string[];
    tenant: Tenant;
    notifications: number;
    structure_organisationnelle: StructureOrganisationnelle;
    created_at: string;
    updated_at: string;
    paths: Array<string>;
  }