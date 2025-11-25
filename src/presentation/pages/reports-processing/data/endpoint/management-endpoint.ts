export const MANAGEMENT_ENDPOINTS = {
    TAKE_QUALIFICATION: 'requests/{id}/take',
    TAKE_PROCESSING: '{id}/take',
    TAKE_FINALIZATION: 'finalizations/{id}/take',

    APPROVE_QUALIFICATION: 'requests/{id}/approve',
    APPROVE_PROCESSING: '{id}/approve',
    FINALIZE: '{id}/finalize',

    REJECT_QUALIFICATION: 'requests/{id}/reject',
    REJECT_PROCESSING: '{id}/reject',

    UPDATE: 'requests/{id}/update',
    PROCESS: '{id}/process',
};
