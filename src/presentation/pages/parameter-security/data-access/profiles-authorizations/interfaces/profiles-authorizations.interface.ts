import { Paginate } from '../../../../../../shared/interfaces/paginate';

export interface ProfilesAuthorizationsInterface {
    id: number;
    nom: string;
    slug: string;
    description: string;
    statut: string;
    created_at: string;
    updated_at: string;
    users_count: number;
    users: interfaceProfilesAuthorizationsUserInterface[];
    mode_lecture: boolean;
    permissions: string[];
    habilitationsNiveauUn: string[];
    habilitationsNiveauDeux: string[];
    habilitationsNiveauTrois: string[];
}

export interface interfaceProfilesAuthorizationsUserInterface {
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
    created_at: string | null;
    updated_at: string | null;
}

export interface ProfilesAuthorizationsApiResponseInterface {
    error: boolean;
    message: string;
    data: Array<ProfilesAuthorizationsInterface>;
}
