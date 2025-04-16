export const BADGE_STAUT_PAIEMENT = {
    DIFFERE: "différé",
    IMMEDIAT: "immédiat",
    MON_COMPTE: "mon compte"
    } as const;
    
    export type T_BADGE_STAUT_PAIEMENT = typeof BADGE_STAUT_PAIEMENT[keyof typeof BADGE_STAUT_PAIEMENT];