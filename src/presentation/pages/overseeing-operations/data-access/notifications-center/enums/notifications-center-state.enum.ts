export const NOTIFICATIONS_CENTER_STATE_ENUM = {
    POSTED: 'posté',
    REJECTED: 'rejeté',
    REPORTED: 'reporté',
    RESULTED: 'soldé',
} as const;

export type T_NOTIFICATIONS_CENTER_STATE_ENUM =
    (typeof NOTIFICATIONS_CENTER_STATE_ENUM)[keyof typeof NOTIFICATIONS_CENTER_STATE_ENUM];
