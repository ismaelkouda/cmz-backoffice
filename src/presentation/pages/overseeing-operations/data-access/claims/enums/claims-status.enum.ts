export const CLAIMS_STATUS_ENUM = {
    SUBMITTED: 'soumis',
    TREATED: 'traité',
    CLOSED: 'clôturé',
} as const;

export type T_CLAIMS_STATUS_ENUM =
    (typeof CLAIMS_STATUS_ENUM)[keyof typeof CLAIMS_STATUS_ENUM];
