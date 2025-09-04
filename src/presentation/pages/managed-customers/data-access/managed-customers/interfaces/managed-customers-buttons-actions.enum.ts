export const MANAGED_CUSTOMERS_BUTTONS_ACTIONS_ENUM = {
    OPEN: 'open-managed-customers',
    NEWSPAPER: 'newspaper-managed-customers',
    SEE: 'see-managed-customers',
} as const;

export type T_MANAGED_CUSTOMERS_BUTTONS_ACTIONS_ENUM =
    typeof MANAGED_CUSTOMERS_BUTTONS_ACTIONS_ENUM[keyof typeof MANAGED_CUSTOMERS_BUTTONS_ACTIONS_ENUM];
