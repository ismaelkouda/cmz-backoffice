export const LIST_REQUESTS_SERVICE = {
    CUSTOMERS_ACTIVATE: 'Activation clients',
};

export type T_LIST_REQUESTS_SERVICE =
    (typeof LIST_REQUESTS_SERVICE)[keyof typeof LIST_REQUESTS_SERVICE];

export const LIST_REQUESTS_SERVICE_KEYS = Object.keys(
    LIST_REQUESTS_SERVICE
) as (keyof typeof LIST_REQUESTS_SERVICE)[];
