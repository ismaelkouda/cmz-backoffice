export const MY_RELOADS_STATUS_ENUM = {
    WAITING: "en-attente",
    IN_PROGRESS: "en-cours",
    VALIDATED: "validé",
    REJECTED: "rejeté"
} as const;
  
export type T_MY_RELOADS_STATUS_ENUM = typeof MY_RELOADS_STATUS_ENUM[keyof typeof MY_RELOADS_STATUS_ENUM];