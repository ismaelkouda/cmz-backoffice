export const TABLE_WHITE_SIM_CARD = {
    cols: [
        { field: '', header: '#', class: "text-center", width: "2rem" },
        { field: 'created_at', header: 'Date / Heure', class: "text-center", width: "12rem" },
        { field: 'numero_demande', header: 'Référence du lot', class: "text-center", width: "12rem" },
        { field: 'nb_numeros_total', header: '# Cartes', class: "text-center", width: "10rem" },
        { field: 'nb_numeros_utilises', header: '# Cartes Utilisées', class: "text-center", width: "10rem" },
        { field: 'nb_numeros_disponibles', header: '# Cartes Disponibles', class: "text-center", width: "10rem" },
        { field: 'taux_utilisation', header: 'Taux d\'utilisation (%)', class: "text-center", width: "6rem" },
        { field: 'statut', header: 'Statut', class: "text-center", width: "4rem" },
        { field: '', header: 'Actions', class: "text-center", width: "10rem" }
    ],
    globalFilterFields: ['created_at','numero_demande','nb_numeros_total','nb_numeros_utilises','nb_numeros_disponibles','statut','taux_utilisation']
}

import { Paginate } from "../../../../../shared/interfaces/paginate";

export interface DossierWhiteSimCard {
    id: number;
    reference: string;
    description: string;
    statut: string;
    premier_numero: string;
    dernier_numero: string;
    nb_numeros_disponibles: number;
    nb_numeros_utilises: number;
    nb_numeros_total: number;
    taux_utilisation: number;
    created_at: string;
    updated_at: string;
}

export interface GlobalStats {
    total: number;
    total_attribues: number;
    total_disponibles: number;
    total_reserves: number;
    total_lots: number;
    pourcentage_attribues: number;
    pourcentage_disponibles: number;
    pourcentage_reserves: number;
    pourcentage_lots: number;
    data: Paginate<DossierWhiteSimCard>;
}

export interface WhiteSimCardPaginatedResponse {
    error: boolean;
    message: string;
    data: GlobalStats;
}
