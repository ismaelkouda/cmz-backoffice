export const SIM_CARD_IDENTIFICATION_ENUM = {
    RELIABLE: "fiable",
    IN_PROGRESS: "en-cours",
    UNRELIABLE: "non-fiable"
} as const;
  
export type T_SIM_CARD_IDENTIFICATION_ENUM = typeof SIM_CARD_IDENTIFICATION_ENUM[keyof typeof SIM_CARD_IDENTIFICATION_ENUM];