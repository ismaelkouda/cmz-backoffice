export const BADGE_STEP_CLAIMS = {
    SOUMISSION: 'soumission',
    TRAITEMENT: 'traitement',
} as const;

export type T_BADGE_STEP_CLAIMS =
    typeof BADGE_STEP_CLAIMS[keyof typeof BADGE_STEP_CLAIMS];
