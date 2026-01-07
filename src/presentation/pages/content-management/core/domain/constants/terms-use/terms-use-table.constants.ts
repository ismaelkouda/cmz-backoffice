export const TERMS_USE_TABLE_CONST = {
    cols: [
        {
            field: '__index',
            header: 'TABLE.COMMON.INDEX',
            class: ' text-center',
            width: '2rem',
        },
        {
            field: 'name',
            header: 'CONTENT_MANAGEMENT.TERMS_USE.TABLE.NAME',
            width: '10rem',
        },
        {
            field: 'version',
            header: 'CONTENT_MANAGEMENT.TERMS_USE.TABLE.VERSION',
            width: '6rem',
        },
        {
            field: 'status',
            header: 'CONTENT_MANAGEMENT.TERMS_USE.TABLE.STATUS',
            class: ' text-center',
            width: '6rem',
        },
        {
            field: 'createdAt',
            header: 'CONTENT_MANAGEMENT.TERMS_USE.TABLE.CREATED_AT',
            class: 'text-center ',
            width: '6rem',
        },
        {
            field: 'publishedAt',
            header: 'CONTENT_MANAGEMENT.TERMS_USE.TABLE.PUBLISHED_AT',
            class: 'text-center ',
            width: '6rem',
        },
        {
            field: '__action',
            header: 'CONTENT_MANAGEMENT.TERMS_USE.TABLE.ACTION',
            class: ' text-center',
            width: '6rem',
        },
    ],
    globalFilterFields: [
        'uniqId',
        'name',
        'version',
        'status',
        'createdAt',
        'publishedAt',
    ],
};
