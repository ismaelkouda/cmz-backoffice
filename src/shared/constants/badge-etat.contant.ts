export const BADGE_ETAT = {
    RECU: 'reçu',
    EN_ATTENTE: 'en-attente',
    APPROUVE: 'approuvé',
    REJETE: 'rejeté',
    EN_COURS: 'en-cours',
    TERMINE: 'terminé',
    LIVRE: 'livré',
    ECHOUE: 'échoué',
    PARTIEL: 'partiel',
    EFFECTUE: 'effectué',
    ACCEPTE: 'accepté',
    REFUSE: 'refusé',
    COMPLET: 'total',
    ABANDONNE: 'abandonné',
    CLOTURE: 'clôturé',
    AFFECTE: 'affecté',
} as const;

export type T_BADGE_ETAT = typeof BADGE_ETAT[keyof typeof BADGE_ETAT];
