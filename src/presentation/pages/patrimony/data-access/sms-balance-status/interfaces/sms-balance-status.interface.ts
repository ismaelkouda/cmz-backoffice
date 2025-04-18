import { Paginate } from '../../../../../../shared/interfaces/paginate';

export interface smsBalanceStatusInterface {
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

export interface smsBalanceStatusGlobalStatsInterface {
    total: number;
    total_attribues: number;
    total_disponibles: number;
    total_reserves: number;
    total_lots: number;
    pourcentage_attribues: number;
    pourcentage_disponibles: number;
    pourcentage_reserves: number;
    pourcentage_lots: number;
    data: Paginate<smsBalanceStatusInterface>;
}

export interface smsBalanceStatusApiResponseInterface {
    error: boolean;
    message: string;
    data: smsBalanceStatusGlobalStatsInterface;
}
