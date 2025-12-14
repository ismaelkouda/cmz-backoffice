export const PRIVACY_POLICY_ENDPOINTS = {
    PRIVACY_POLICY: 'cms/privacy-policies?page={page}',
    GET_BY_ID: 'cms/privacy-policies/{id}',
    CREATE: 'cms/privacy-policies/store',
    UPDATE: 'cms/privacy-policies/{id}/update',
    DELETE: 'cms/privacy-policies/{id}/delete',
    PUBLISH: 'cms/privacy-policies/{id}/publish',
    UNPUBLISH: 'cms/privacy-policies/{id}/unpublish',
} as const;
