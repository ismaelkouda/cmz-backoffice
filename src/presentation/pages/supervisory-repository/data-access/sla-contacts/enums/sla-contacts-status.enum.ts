export const SLA_CONTACTS_STATUS_ENUM = {
    ACTIVE: 'actif',
    INACTIVE: 'inactif',
} as const;

export type T_SLA_CONTACTS_STATUS_ENUM =
    typeof SLA_CONTACTS_STATUS_ENUM[keyof typeof SLA_CONTACTS_STATUS_ENUM];
