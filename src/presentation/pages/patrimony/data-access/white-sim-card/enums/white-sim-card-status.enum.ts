export const WHITE_SIM_CARD_STATUS_ENUM = {
    AVAILABLE: "disponible",
    OUT: "epuisé"
} as const;
export type T_WHITE_SIM_CARD_STATUS_ENUM = typeof WHITE_SIM_CARD_STATUS_ENUM[keyof typeof WHITE_SIM_CARD_STATUS_ENUM];