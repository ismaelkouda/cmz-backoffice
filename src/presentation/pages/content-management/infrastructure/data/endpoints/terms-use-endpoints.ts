export const TERMS_USE_ENDPOINTS = {
    TERMS_USE: 'cms/terms-of-use?page={page}',
    GET_BY_ID: 'cms/terms-of-use/{id}',
    CREATE: 'cms/terms-of-use/store',
    UPDATE: 'cms/terms-of-use/{id}/update',
    DELETE: 'cms/terms-of-use/{id}/delete',
    PUBLISH: 'cms/terms-of-use/{id}/publish',
    UNPUBLISH: 'cms/terms-of-use/{id}/unpublish',
} as const;
