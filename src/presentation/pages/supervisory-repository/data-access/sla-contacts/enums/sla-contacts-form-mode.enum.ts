export const SLA_CONTACTS_FORM_MODE_ENUM = {
    SEE: 'voir',
    EDIT: 'modifier',
} as const;

export type T_SLA_CONTACTS_FORM_MODE_ENUM =
    typeof SLA_CONTACTS_FORM_MODE_ENUM[keyof typeof SLA_CONTACTS_FORM_MODE_ENUM];
