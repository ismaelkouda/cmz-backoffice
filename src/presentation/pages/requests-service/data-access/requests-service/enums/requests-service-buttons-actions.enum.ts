export const REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM = {
    OPEN: 'open-customers-subscription',
    EDIT: 'edit-customers-subscription',
    ADD: 'add-customers-subscription',
    PAYMENT: 'payment-customers-subscription',
    INVOICE: 'invoice-customers-subscription',
    NEWSPAPER: 'newspaper-customers-subscription',
    SEE: 'see-customers-subscription',
} as const;

export type T_REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM =
    typeof REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM[keyof typeof REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM];
