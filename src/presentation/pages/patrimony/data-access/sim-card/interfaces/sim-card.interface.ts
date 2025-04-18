import { Paginate } from '../../../../../../shared/interfaces/paginate';

export interface simCardInterface {
    id: number;
    imsi: string;
    msisdn: string;
    iccid: string;
    usage_id: number | null;
    formule: string;
    formule_uuid: string;
    niveau_un_uuid: string;
    niveau_deux_uuid: string;
    niveau_trois_uuid: string;
    point_emplacement: string | null;
    adresse_geographique: string | null;
    adresse_ip: string | null;
    apn: string;
    longitude: string | null;
    latitude: string | null;
    qrcode: string | null;
    statut: string;
    identification_fiabilite: string;
    operateur: string | null;
    nom_usage: string | null;
    niveau_uns_nom: string;
    niveau_deux_nom: string;
    niveau_trois_nom: string;
    geoloc: string | null;
    quartier: string | null;
    date_id: string | null;
    date_localisation: string | null;
    site_reseau: string | null;
    long_reseau: string | null;
    lat_reseau: string | null;
}

export interface simCardApiResponseInterface {
    error: boolean;
    message: string;
    data: Paginate<simCardInterface>;
}
