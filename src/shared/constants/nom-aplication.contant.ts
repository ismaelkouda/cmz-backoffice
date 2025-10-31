export const NOM_APPLICATION = {
    PATRIMOINE_SIM: 'Patrimoine SIM',
    SIM_MONITORING: 'SIM monitoring',
} as const;

export type T_NOM_APPLICATION =
    (typeof NOM_APPLICATION)[keyof typeof NOM_APPLICATION];
