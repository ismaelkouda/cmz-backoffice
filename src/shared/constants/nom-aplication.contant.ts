export const APP_NAME = {
    CONNECT_MY_ZONE: 'Connect My Zone',
    SIM_MONITORING: 'SIM monitoring',
} as const;

export type T_APP_NAME =
    (typeof APP_NAME)[keyof typeof APP_NAME];
