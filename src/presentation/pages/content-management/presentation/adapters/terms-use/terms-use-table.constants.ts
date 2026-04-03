export const TERMS_USE_TABLE = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'version',
            header: 'CONTENT_MANAGEMENT.TERMS_USE.TABLE.VERSION',
            width: '6rem',
        },
        {
            field: 'statusLabel',
            header: 'CONTENT_MANAGEMENT.TERMS_USE.TABLE.STATUS',
            class: 'text-center',
            width: '6rem',
        },
        {
            field: 'createdAt',
            header: 'CONTENT_MANAGEMENT.TERMS_USE.TABLE.CREATED_AT',
            class: 'text-center',
            width: '6rem',
        },
        {
            field: 'publishedAt',
            header: 'CONTENT_MANAGEMENT.TERMS_USE.TABLE.PUBLISHED_AT',
            class: 'text-center',
            width: '6rem',
        },
        {
            field: '__actionDropdown',
            header: 'CONTENT_MANAGEMENT.TERMS_USE.TABLE.ACTION',
            class: 'text-center',
            width: '6rem',
        },
    ],
    globalFilterFields: [
        'uniqId',
        'name',
        'version',
        'statusLabel',
        'createdAt',
        'publishedAt',
    ],
};
