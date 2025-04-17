export const PAYMENT_STATUS_ENUM = {
    WAITING: "en-attente",
    RESULTED: 'soldée',
    REJECTED: "rejetée",
    REPORTED: "reportée",
    POSTED: "postée",
    ABANDONED: "abandonnée",
} as const;
  
export type T_PAYMENT_STATUS_ENUM = typeof PAYMENT_STATUS_ENUM[keyof typeof PAYMENT_STATUS_ENUM];