export const CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM = {
    OPEN: 'open-managed-customers',
    NEWSPAPER: 'newspaper-managed-customers',
    SEE: 'see-managed-customers',
} as const;

export type T_CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM =
    (typeof CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM)[keyof typeof CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM];
