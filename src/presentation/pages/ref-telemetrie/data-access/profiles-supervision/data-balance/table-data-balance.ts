export const TABLE_DATA_BALANCE = {
    cols: [
        { field: '', header: '#', class: "text-center", width: "2rem" },
        { field: 'nom', header: 'Nom du Profil', class: "text-center", width: "12rem" },
        { field: 'description', header: 'Description du Profil', class: "text-center", width: "12rem" },
        { field: 'created_at', header: 'Date de création', class: "text-center", width: "10rem" },
        { field: 'updated_at', header: 'Date de modification', class: "text-center", width: "10rem" },
        { field: 'sims_count', header: '# SIM Affectés', class: "text-center", width: "10rem" },
        { field: 'is_deployed', header: 'Déploiement', class: "text-center", width: "6rem" },
        { field: 'statut', header: 'Statut', class: "text-center", width: "4rem" },
        { field: '', header: 'Actions', class: "text-center", width: "10rem" }
    ],
    globalFilterFields: ['nom','description','created_at','updated_at','sims_count','statut','is_deployed']
}

import { Paginate } from "../../../../../../shared/interfaces/paginate";

export interface DataBalance {
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
    data: Paginate<DataBalance>;
}

export interface DataBalancePaginatedResponse {
    error: boolean;
    message: string;
    data: GlobalStats;
}
