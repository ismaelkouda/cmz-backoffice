export const CUSTOMERS_MANAGED_STEP_ENUM = {
    ON: 'actif',
    OFF: 'inactif',
} as const;

export type T_CUSTOMERS_MANAGED_STEP_ENUM =
    typeof CUSTOMERS_MANAGED_STEP_ENUM[keyof typeof CUSTOMERS_MANAGED_STEP_ENUM];
