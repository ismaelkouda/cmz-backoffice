export const OVERSEEING_OPERATIONS_BUTTONS_ACTIONS_ENUM = {
    OPEN: 'open-customers-subscription',
    EDIT: 'edit-customers-subscription',
    ADD: 'add-customers-subscription',
    PAYMENT: 'payment-customers-subscription',
    INVOICE: 'invoice-customers-subscription',
    NEWSPAPER: 'newspaper-customers-subscription',
    SEE: 'see-customers-subscription',
    CLOSURE: 'closure-customers-subscription',
} as const;

export type T_OVERSEEING_OPERATIONS_BUTTONS_ACTIONS_ENUM =
    (typeof OVERSEEING_OPERATIONS_BUTTONS_ACTIONS_ENUM)[keyof typeof OVERSEEING_OPERATIONS_BUTTONS_ACTIONS_ENUM];
