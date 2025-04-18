interface Intervenant {
    id: number;
    matricule: string;
    nom: string;
    prenoms: string;
    username: string;
    adresse: string;
    contacts: string;
    email: string;
}

export interface ReloadAccountOperationDetailsInterface {
    id: number;
    transaction: string;
    mode_paiement: 'Espèce' | 'Chèque';
    operation: string;
    type: 'Crédit' | 'Débit';
    code_banque_tireur: string;
    code_banque_beneficiaire: string;
    code_agence_beneficiaire: string;
    nom_tireur: string | null;
    numero_cheque: string | null;
    montant: string;
    piece_jointe_bordereau: string;
    date_remise: string; // format "YYYY-MM-DD"
    nom_deposant: string | null;
    prenom_deposant: string | null;
    contact_deposant: string | null;
    initie_par: number;
    acquitte_a: string; // format "YYYY-MM-DD HH:mm:ss"
    acquitte_par: number;
    traite_a: string;
    traite_par: number;
    cloture_par: number | null;
    cloture_a: string | null;
    statut: string;
    etat_traitement: string;
    accepte: string;
    commentaire_approbation: string | null;
    otp_code: string;
    otp_expires_at: string; // format "YYYY-MM-DD HH:mm:ss"
    created_at: string;
    updated_at: string;

    demandeur_nom: string;
    demandeur_prenoms: string;
    demandeur_contacts: string;
    demandeur_email: string;
    demandeur_matricule: string;

    nom_banque_beneficiaire: string;
    rib_banque_beneficiaire: string;
    nom_banque_tireur: string;
    nom_agence_beneficiaire: string;

    intervenant: Intervenant;
    user_traiteur: Intervenant;
}

export interface ReloadAccountOperationDetailsApiResponseInterface {
    error: boolean;
    message: string;
    data: ReloadAccountOperationDetailsInterface;
}
