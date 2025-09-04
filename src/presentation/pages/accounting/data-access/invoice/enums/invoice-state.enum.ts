export const INVOICE_STATE_ENUM = {
    WAITING: 'en-attente',
    RESULTED: 'soldée',
    REJECTED: 'rejetée',
    REPORTED: 'reportée',
    POSTED: 'postée',
    NON_SOLDEE: 'non-soldée',
} as const;

export type T_INVOICE_STATE_ENUM =
    typeof INVOICE_STATE_ENUM[keyof typeof INVOICE_STATE_ENUM];
