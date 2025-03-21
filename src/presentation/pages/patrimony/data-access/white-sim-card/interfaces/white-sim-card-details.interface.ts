import { Paginate } from "../../../../../../shared/interfaces/paginate";

export interface whiteSimCardDetailsResponseInterface {
  error: boolean;
  message: string;
  data: whiteSimCardDetailsGlobalStateInterface;
}

export interface whiteSimCardDetailsGlobalStateInterface {
  total: number;
  total_lots: number;
  total_disponibles: number;
  total_attribues: number;
  total_reserves: number;
  pourcentage_lots: number;
  pourcentage_disponibles: number;
  pourcentage_attribues: number;
  pourcentage_reserves: number;
  data: Paginate<whiteSimCardDetailsInterface>;
}

export interface whiteSimCardDetailsInterface {
  id: number;
  reference: string;
  numero_demande: string;
  premier_numero: string;
  dernier_numero: string;
  nb_numeros_total: number;
  nb_numeros_utilises: number;
  statut: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  nb_numeros_disponibles: number;
  taux_utilisation: number;
}