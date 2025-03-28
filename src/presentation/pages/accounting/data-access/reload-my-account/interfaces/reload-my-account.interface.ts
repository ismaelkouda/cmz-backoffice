import { Paginate } from "../../../../../../shared/interfaces/paginate";

export interface reloadMyAccountInterface {
  id: number;
  transaction: string;
  mode_paiement: string;
  operation: string;
  code_banque: string;
  reference: string;
  montant: string;
  justificatif: string;
  date_remise: string | null; // Since date_remise can be null
  titulaire: string;
  numero: string | null; // Since numero can be null
  solde_avant: string;
  solde_apres: string;
  initie_par: number;
  traite_a: string | null; // Since traite_a can be null
  traite_par: string | null; // Since traite_par can be null
  in_basket: boolean;
  accepte: string | null; // Since accepte can be null
  cloture_par: string | null; // Since cloture_par can be null
  statut: string;
  created_at: string;
  updated_at: string;
  type: "Crédit" | "Debit";
}

export interface reloadMyAccountApiResponseInterface {
    error: boolean;
    message: string;
    data: Paginate<reloadMyAccountInterface>;
}
