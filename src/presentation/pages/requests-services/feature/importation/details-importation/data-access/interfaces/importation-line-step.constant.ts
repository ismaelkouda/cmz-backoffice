export const IMPORTATION_LINE_STEP = {
    FAILURE: 'echec',
    SUCCESS: 'succès',
} as const;

export type T_IMPORTATION_LINE_STEP =
    typeof IMPORTATION_LINE_STEP[keyof typeof IMPORTATION_LINE_STEP];
