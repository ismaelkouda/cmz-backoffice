export const BADGE_ETAPE = {
    SOUMISSION: 'soumission',
    TRAITEMENT: 'traitement',
    FINALISATEUR: 'finalisation',
    CLOTURE: 'clôture',
} as const;

export type T_BADGE_ETAPE = typeof BADGE_ETAPE[keyof typeof BADGE_ETAPE];
