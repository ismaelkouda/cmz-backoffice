export const INVOICE_BUTTONS_ACTIONS_ENUM = {
    INVOICE: 'invoice-accounting',
} as const;

export type T_INVOICE_BUTTONS_ACTIONS_ENUM =
    typeof INVOICE_BUTTONS_ACTIONS_ENUM[keyof typeof INVOICE_BUTTONS_ACTIONS_ENUM];
