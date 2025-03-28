export const INVOICE_STATUS_ENUM = {
    WAITING: "en-attente",
    RESULTED: 'soldée',
    REJECTED: "rejetée",
    REPORTED: "reportée",
    POSTED: "posted",
} as const;
  
export type T_INVOICE_STATUS_ENUM = typeof INVOICE_STATUS_ENUM[keyof typeof INVOICE_STATUS_ENUM];