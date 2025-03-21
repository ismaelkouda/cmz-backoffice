type T_criticality = "mineur" | "majeur" | "critique";
export interface indicatorsAlarmsInterface {
  id: number;
  classification: string;
  description: string;
  criticite: T_criticality;
  type: string;
  type_mesure: string;
  frequence: string;
  seuil: string;
  unite: string;
  statut: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface indicatorsAlarmsApiResponseInterface {
  error: boolean;
  message: string;
  data: indicatorsAlarmsInterface;
}
