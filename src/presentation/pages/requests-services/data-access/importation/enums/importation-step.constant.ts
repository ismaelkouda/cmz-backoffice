export const IMPORTATION_STEP = {
    IN_WAITING: 'en-attente',
    PARTIAL: 'partiel',
    COMPLETE: 'complet',
} as const;

export type T_IMPORTATION_STEP =
    typeof IMPORTATION_STEP[keyof typeof IMPORTATION_STEP];
