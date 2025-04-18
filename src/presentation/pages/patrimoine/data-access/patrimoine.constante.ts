export const STOCKAGE_NUMEROS = 'stockages-msisdn';
export const STOCKAGE_CARTES_SIM = 'stockages-carte-sim';
export const STOCKAGE_APN_IP = 'stockages-apn-adresse';
export const STATUS = [
    { libelle: 'Disponible', code: 'disponible' },
    { libelle: 'Epuisé', code: 'epuisé' },
] as const;
export type T_STATUS = typeof STATUS[keyof typeof STATUS];

export const STATUT_DETAILS = [
    { libelle: 'Disponible', code: 'disponible' },
    { libelle: 'Attribué', code: 'attribué' },
    { libelle: 'Reservé', code: 'reservé' },
] as const;
export type T_STATUT_DETAILS =
    typeof STATUT_DETAILS[keyof typeof STATUT_DETAILS];
