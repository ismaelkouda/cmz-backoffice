export const MANAGED_CUSTOMERS_STEP_ENUM = {
    ON: 'actif',
    OFF: 'inactif',
} as const;

export type T_MANAGED_CUSTOMERS_STEP_ENUM =
    typeof MANAGED_CUSTOMERS_STEP_ENUM[keyof typeof MANAGED_CUSTOMERS_STEP_ENUM];
