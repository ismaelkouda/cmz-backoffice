export const TYPE_CUSTOMERS_ENUM = {
    COMMERCIAL_ENTERPRISE: 'Commerciale',
    PUBLIC_ENTERPRISES: 'Publique',
    ASSOCIATION_ENTERPRISES: 'Association',
    INDIVIDUALS: 'Personne physique',
};

export type T_TYPE_CUSTOMERS_ENUM =
    (typeof TYPE_CUSTOMERS_ENUM)[keyof typeof TYPE_CUSTOMERS_ENUM];
