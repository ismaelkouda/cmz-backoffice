export const IMPORTATION_STEP = {
    FAILURE: 'échec',
    IN_WAITING: 'en-attente',
    PARTIAL: 'partiel',
    COMPLETE: 'complet',
} as const;

export type T_IMPORTATION_STEP =
    typeof IMPORTATION_STEP[keyof typeof IMPORTATION_STEP];
