export enum TypePayment {
    POST_PAID = 'Post-Paid',
    PRE_PAID = 'Pre-Paid',
    VIA_ACCOUNT = 'Via Compte',
}

export type T_TypePayment = typeof TypePayment[keyof typeof TypePayment];
