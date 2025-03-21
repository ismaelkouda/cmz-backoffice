export const BADGE_ETAT_FACTURE = {
  EN_ATTENTE: 'en-attente',
  SOLDEE: 'soldée',
  REJETEE: 'rejetée',
  REPORTEE: 'reportée',
  POSTEE: 'postée',
  } as const;
  
  export type T_BADGE_ETAT_FACTURE = typeof BADGE_ETAT_FACTURE[keyof typeof BADGE_ETAT_FACTURE];