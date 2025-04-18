export const MODE_PAYMENT_ENUM = {
    SPECIE: 'Espèce',
    CHEQUE: 'Chèque',
} as const;

export type T_MODE_PAYMENT_ENUM =
    typeof MODE_PAYMENT_ENUM[keyof typeof MODE_PAYMENT_ENUM];
