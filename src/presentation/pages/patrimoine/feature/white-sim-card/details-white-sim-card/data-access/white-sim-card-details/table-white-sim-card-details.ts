export const TABLE_WHITE_SIM_CARD_DETAILS = {
  cols: [
      { field: '', header: '#', class: "text-center", width: "2rem" },
      { field: 'created_at', header: 'Date / Heure', class: "text-center", width: "12rem" },
      { field: 'imsi', header: 'IMSI', class: "text-center", width: "12rem" },
      { field: 'iccid', header: 'ICCID', class: "text-center", width: "12rem" },
      { field: 'statut', header: 'Statut', class: "text-center", width: "4rem" },
  ],
  globalFilterFields: ['created_at','imsi','iccid','statut']
}

export interface WhiteSimCardDetailsResponse {
    data: WhiteSimCardDetails;
    error: boolean;
    message: string;
}

export interface WhiteSimCard {
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
  

  export interface WhiteSimCardDetails {
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
    carteSims: WhiteSimCard[];
  }
