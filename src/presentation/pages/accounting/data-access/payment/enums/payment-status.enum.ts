export const PAYMENT_STATUS_ENUM = {
    UNKNOWN: 'inconnu',
    ABANDONED: 'abandonné',
    POSTED: 'posté',
    VALIDATED: 'validé',

    WAITING: 'en-attente',
    RESULTED: 'soldée',
    NO_RESULTED: 'non-soldée',
    REJECTED: 'rejeté',
    REPORTED: 'reporté',
} as const;

export type T_PAYMENT_STATUS_ENUM =
    typeof PAYMENT_STATUS_ENUM[keyof typeof PAYMENT_STATUS_ENUM];
