type T_STATUS = 'actif' | 'inactif';
export interface slaAgreementsInterface {
    id: number;
    parametrage_sla_id: number;
    code_service: string;
    nom_service: string;
    description: string;
    ack: number;
    traitement: number;
    cloture: number;
    escalade: number;
    statut: T_STATUS;
    created_at: string;
    updated_at: string;
    cout_unitaire: number;
}

export interface slaAgreementsApiResponseInterface {
    error: boolean;
    message: string;
    data: slaAgreementsInterface;
}
