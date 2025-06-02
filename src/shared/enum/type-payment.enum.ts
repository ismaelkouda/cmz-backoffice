export enum TypePayment {
    POST_PAID = 'PostPaid',
    PRE_PAID = 'PrePaid',
    VIA_ACCOUNT = 'via Compte',
}

export type T_TypePayment = typeof TypePayment[keyof typeof TypePayment];
