export const REQUESTS_SERVICE_TREATMENT_ENUM = {
    MODIFY: 'Modifier',
    CLOSURE: 'cloturer',
    ABANDON: 'abandonner',
    VIEW: 'voir',
};

export type T_REQUESTS_SERVICE_TREATMENT_ENUM =
    typeof REQUESTS_SERVICE_TREATMENT_ENUM[keyof typeof REQUESTS_SERVICE_TREATMENT_ENUM];
