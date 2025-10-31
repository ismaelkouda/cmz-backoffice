export const SLA_AGREEMENTS_STATUS_ENUM = {
    ACTIVE: 'actif',
    INACTIVE: 'inactif',
} as const;

export type T_SLA_AGREEMENTS_STATUS_ENUM =
    (typeof SLA_AGREEMENTS_STATUS_ENUM)[keyof typeof SLA_AGREEMENTS_STATUS_ENUM];
