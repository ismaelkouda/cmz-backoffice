export const BADGE_ETAT_FACTURE = {
    EN_ATTENTE: 'en-attente',
    SOLDEE: 'soldé',
    REJETEE: 'rejeté',
    REPORTEE: 'reporté',
    POSTEE: 'posté',
    VALIDEE: 'validé',
    ABANDONNEE: 'abandonné',
    SOUMISSION: 'soumission',
    TRAITEMENT: 'traitement',
    FINALISATEUR: 'finalisation',
    CLOTURE: 'clôture',
} as const;

export type T_BADGE_ETAT_FACTURE =
    (typeof BADGE_ETAT_FACTURE)[keyof typeof BADGE_ETAT_FACTURE];
