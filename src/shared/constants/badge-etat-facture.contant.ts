export const BADGE_ETAT_FACTURE = {
  EN_ATTENTE: 'en-attente',
  ANNULEE: 'annulée',
  EN_COURS: 'en-cours',
  SOLDEE: 'soldée',
  NON_SOLDEE: 'non-soldée',
  RATTACHEE: 'rattachée',
  IMPAYEE: 'impayée',
  REJETEE: 'rejetée',
  REPORTEE: 'reportée',
  } as const;
  
  export type T_BADGE_ETAT_FACTURE = typeof BADGE_ETAT_FACTURE[keyof typeof BADGE_ETAT_FACTURE];