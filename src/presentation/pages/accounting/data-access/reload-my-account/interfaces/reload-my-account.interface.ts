import { Paginate } from '../../../../../../shared/interfaces/paginate';

export interface reloadMyAccountInterface {
    id: number;
    transaction: string;
    mode_paiement: string;
    reference: string;
    montant: string;
    justificatif: string;
    date_remise: string | null;
    titulaire: string;
    numero: string;
    solde_avant: string | null;
    solde_apres: string | null;
    initie_par: number;
    traite_a: string | null;
    traite_par: string | null;
    in_basket: boolean;
    accepte: string | null;
    commentaire_approbation: string | null;
    cloture_par: string | null;
    statut: string;
    created_at: string;
    updated_at: string;
}

export interface reloadMyAccountApiResponseInterface {
    error: boolean;
    message: string;
    data: reloadMyAccountGlobalStateInterface;
}

export interface reloadMyAccountGlobalStateInterface {
    mon_compte: string;
    totalRechargements: number;
    totalEnAttentes: number;
    TotalValides: number;
    totalRejetes: number;
    totalEncours: number;
    pourcentageEnAttentes: number;
    pourcentageValide: number;
    pourcentageRejetes: number;
    pourcentageEnCours: number;
    data: Paginate<reloadMyAccountInterface>;
}
