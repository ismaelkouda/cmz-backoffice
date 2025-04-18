export interface whiteSimCardDetailsResponseInterface {
    data: whiteSimCardDetailsInterface;
    error: boolean;
    message: string;
}

export interface WhiteSimCardInterface {
    id: number;
    transaction: string;
    numero_demande: string;
    locked_until: string;
    carton_sim_id: number;
    imsi: string;
    iccid: string;
    statut: string;
    created_at: string;
    updated_at: string;
}

export interface whiteSimCardDetailsInterface {
    id: number;
    reference: string;
    description: string;
    statut: string;
    premier_numero: string;
    dernier_numero: string;
    nb_numeros_total: number;
    nb_numeros_utilises: number;
    created_at: string;
    updated_at: string;
    numero_demande: string;
    carte_sims: WhiteSimCardInterface[];
}
