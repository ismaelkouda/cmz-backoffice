import { Paginate } from '../../../../../../shared/interfaces/paginate';

export interface InvoiceInterface {
    id: number;
    demande_id: number;
    tenant_code: string;
    nom_tenant: string;
    numero_demande: string;
    description: string;
    justificatif: string | null;
    operation: string;
    bac_a_pioche: string | null;
    cloture_a: string | null;
    nb_demande_soumises: number;
    nb_demande_traitees: number;
    nb_demande_cloturees: number;
    nb_demande_identifiees: number;
    initie_par: number;
    statut: string;
    recu_paiement: string | null;
    type: string;
    nb_cycle: number;
    niveau_un_uuid: string | null;
    niveau_deux_uuid: string | null;
    niveau_trois_uuid: string | null;
    formule_uuid: string;
    montant_formule: number | null;
    usage_id: number;
    equipe_id: number | null;
    intervenant_id: number | null;
    traite_a: string | null;
    traite_par: string | null;
    cloture_par: string | null;
    abandonne_a: string | null;
    abandonne_par: string | null;
    acquitte_a: string | null;
    acquitte_par: string | null;
    commentaire_traitement: string | null;
    traitement: string;
    commentaire_cloture: string | null;
    nb_demande_echouees: number;
    finalise_a: string | null;
    finalise_par: string | null;
    etat_soumission: string;
    etat_traitement: string | null;
    etat_finalisation: string | null;
    etat_cloture: string | null;
    accepte_approbation: string | null;
    commentaire_approbation: string | null;
    approuve_par: string | null;
    approuve_a: string | null;
    commentaire_finalisation: string | null;
    demandeur_nom: string;
    demandeur_prenoms: string;
    demandeur_contacts: string;
    demandeur_email: string;
    demandeur_matricule: string;
    created_at: string;
    updated_at: string;
    commentaire_livraison: string | null;
    livre_par: string | null;
    livre_a: string | null;
    delai_ack: number;
    delai_traitement: number;
    delai_cloture: number;
    delai_escalade: number;
    source: string;
    type_paiement: string;
    date_soumission_facture: string | null;
    etat_facture: string;
}

export interface invoiceApiResponseInterface {
    error: boolean;
    message: string;
    data: invoiceGlobalStatsInterface;
}

export interface invoiceGlobalStatsInterface {
    mon_compte: string;
    total_differes: number;
    total_en_attentes: number;
    total_factures: number;
    total_immediats: number;
    data: Paginate<InvoiceInterface>;
}
