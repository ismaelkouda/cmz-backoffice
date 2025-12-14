export const HOME_ENDPOINTS = {
    HOME: 'cms/home-block-infos?page={page}',
    GET_BY_ID: 'cms/home-block-infos/{id}',
    CREATE: 'cms/home-block-infos/store',
    UPDATE: 'cms/home-block-infos/{id}/update',
    DELETE: 'cms/home-block-infos/{id}/delete',
    ENABLE: 'cms/home-block-infos/{id}/enable',
    DISABLE: 'cms/home-block-infos/{id}/disable',
} as const;
