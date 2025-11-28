export const ACTIONS_ENDPOINTS = {
    ACTIONS: 'processing-actions?page={page}',
    CREATE: 'processing-actions/store',
    UPDATE: 'processing-actions/{id}/update',
    DELETE: 'processing-actions/{id}/delete',
} as const;
