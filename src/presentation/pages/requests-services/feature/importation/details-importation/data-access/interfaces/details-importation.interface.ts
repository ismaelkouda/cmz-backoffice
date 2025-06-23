import { Paginate } from '../../../../../../../../shared/interfaces/paginate';

export interface DetailsImportationInterface {
    transaction: string;
    msisdn: string;
    imsi: string;
    iccid: string;
    numero_demande: string;
    intervenant_id: number;
    initie_par: number;
    created_at: string;
    updated_at: string;
    operation: string;
    code_rapport: string;
    action: string | null;
    traitement: string;
    date_acquittement: string;
    date_traitement: string;
    date_cloture: string;
    message: string;
    model_id: number;
    notation_cloture: string | null;
    statut: string;
    demandeur_nom: string;
    demandeur_prenoms: string;
    demandeur_contacts: string;
    demandeur_email: string;
    demandeur_matricule: string;
    niveau_un: string | null;
}

export interface ImportationApiResponseInterface {
    error: boolean;
    message: string;
    data: Paginate<Array<DetailsImportationInterface>>;
}
