export interface WaitingQueueFilterInterface {
    date_debut: string;
    date_fin: string;
    operation?: string;
    numero_demande?: string;
    statut?: string;
    traitement?: string;
    nom_tenant?: string;
    initie_par?: string;
}
