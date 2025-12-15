export const NEWS_ENDPOINTS = {
    NEWS: 'cms/news?page={page}',
    GET_BY_ID: 'cms/news/{id}',
    GET_CATEGORY: 'cms/categories/selected-field',
    CREATE: 'cms/news/store',
    UPDATE: 'cms/news/{id}/update',
    DELETE: 'cms/news/{id}/delete',
    ENABLE: 'cms/news/{id}/publish',
    DISABLE: 'cms/news/{id}/unpublish',
} as const;
