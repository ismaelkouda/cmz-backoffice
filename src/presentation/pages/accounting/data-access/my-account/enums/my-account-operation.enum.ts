export const MY_ACCOUNT_OPERATION_ENUM = {
    CREDIT: "Crédit",
    DEBIT: "Débit"
} as const;
  
export type T_MY_ACCOUNT_OPERATION_ENUM = typeof MY_ACCOUNT_OPERATION_ENUM[keyof typeof MY_ACCOUNT_OPERATION_ENUM];