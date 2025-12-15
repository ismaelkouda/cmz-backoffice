export const LEGAL_NOTICE_ENDPOINTS = {

    LEGAL_NOTICE: 'cms/legal-notices?page={page}',
    GET_BY_ID: 'cms/legal-notices/{id}',
    CREATE: 'cms/legal-notices/store',
    UPDATE: 'cms/legal-notices/{id}/update',
    DELETE: 'cms/legal-notices/{id}/delete',
    PUBLISH: 'cms/legal-notices/{id}/publish',
    UNPUBLISH: 'cms/legal-notices/{id}/unpublish',
} as const;
