export const SIM_CARD_STATUS_ENUM = {
    ACTIVE: "actif",
    SUSPENDED: "suspendu",
    RESILIATE: "resilié"
} as const;
  
export type T_SIM_CARD_STATUS_ENUM = typeof SIM_CARD_STATUS_ENUM[keyof typeof SIM_CARD_STATUS_ENUM];