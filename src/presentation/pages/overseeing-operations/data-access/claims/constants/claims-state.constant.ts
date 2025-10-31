export const BADGE_STATE_CLAIMS = {
    IN_WAITING: 'en-attente',
    IN_PROGRESS: 'en-cours',
    APPROVED: 'approuvé',
    ABANDONED: 'abandonné',
    REJECTED: 'rejeté',
} as const;

export type T_BADGE_STATE_CLAIMS =
    (typeof BADGE_STATE_CLAIMS)[keyof typeof BADGE_STATE_CLAIMS];
