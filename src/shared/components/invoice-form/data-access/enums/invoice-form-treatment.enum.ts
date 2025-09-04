export const INVOICE_FORM_TREATMENT_ENUM = {
    PROFORMA: 'Modifier',
    INVOICE: 'cloturer',
};

export type T_INVOICE_FORM_TREATMENT_ENUM =
    typeof INVOICE_FORM_TREATMENT_ENUM[keyof typeof INVOICE_FORM_TREATMENT_ENUM];
