export const SLIDE_ENDPOINTS = {
    SLIDE: 'cms/slides?page={page}',
    GET_BY_ID: 'cms/slides/{id}',
    CREATE: 'cms/slides/store',
    UPDATE: 'cms/slides/{id}/update',
    DELETE: 'cms/slides/{id}/delete',
    ENABLE: 'cms/slides/{id}/enable',
    DISABLE: 'cms/slides/{id}/disable',
} as const;
