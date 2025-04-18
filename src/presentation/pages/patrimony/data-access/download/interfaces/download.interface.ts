import { Paginate } from '../../../../../../shared/interfaces/paginate';

export interface downloadInterface {
    id: number;
    date_fichier: string;
    slug: string;
    nom_fichier: string;
    url_fichier: string;
    taille_fichier: number;
    created_at: string;
    updated_at: string;
}

export interface downloadApiResponseInterface {
    error: boolean;
    message: string;
    data: Paginate<downloadInterface>;
}
