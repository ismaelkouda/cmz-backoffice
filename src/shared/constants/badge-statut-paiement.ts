export const BADGE_STAUT_PAIEMENT = {
    DIFFERE: 'PostPaid',
    IMMEDIAT: 'PrePaid',
    MON_COMPTE: 'via Compte',
} as const;

export type T_BADGE_STAUT_PAIEMENT =
    typeof BADGE_STAUT_PAIEMENT[keyof typeof BADGE_STAUT_PAIEMENT];
