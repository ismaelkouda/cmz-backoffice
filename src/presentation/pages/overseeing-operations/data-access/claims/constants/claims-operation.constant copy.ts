export const BADGE_OPERATION_CLAIMS = {
    EN_ATTENTE: 'en-attente',
    SOLDEE: 'soldée',
    REJETEE: 'rejetée',
    REPORTEE: 'reportée',
    POSTEE: 'postée',
    ABANDONNEE: 'abandonnée',
} as const;

export type T_BADGE_OPERATION_CLAIMS =
    typeof BADGE_OPERATION_CLAIMS[keyof typeof BADGE_OPERATION_CLAIMS];
