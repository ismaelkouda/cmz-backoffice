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
    id: number;
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
  }
  
  export interface ApiResponseApplicantInterface {
    error: boolean;
    message: string;
    data: ApplicantInterface[];
  }