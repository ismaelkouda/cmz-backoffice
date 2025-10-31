export const REQUESTS_SERVICE_PAYMENT_STATE_ENUM = {
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

export type T_REQUESTS_SERVICE_PAYMENT_STATE_ENUM =
    (typeof REQUESTS_SERVICE_PAYMENT_STATE_ENUM)[keyof typeof REQUESTS_SERVICE_PAYMENT_STATE_ENUM];
