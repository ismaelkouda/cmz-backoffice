export const RELOAD_MY_ACCOUNT_STATUS_ENUM = {
    WAITING: "en-attente",
    VALIDATED: "validé",
    REJECTED: "rejecté"
} as const;
  
export type T_RELOAD_MY_ACCOUNT_STATUS_ENUM = typeof RELOAD_MY_ACCOUNT_STATUS_ENUM[keyof typeof RELOAD_MY_ACCOUNT_STATUS_ENUM];