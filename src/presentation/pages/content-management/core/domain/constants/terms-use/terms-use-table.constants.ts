export const TERMS_USE_TABLE_CONST = {
    cols: [
        {
            field: '__index',
            header: 'TABLE.COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'content',
            header: 'CONTENT_MANAGEMENT.TERMS_USE.TABLE.CONTENT',
            width: '35rem',
        },
        {
            field: 'status',
            header: 'CONTENT_MANAGEMENT.TERMS_USE.TABLE.STATE',
            class: 'text-top text-center',
            width: '4rem',
        },
        {
            field: 'createdAt',
            header: 'CONTENT_MANAGEMENT.TERMS_USE.TABLE.CREATED_AT',
            class: 'text-center text-top',
            width: '4rem',
        },
        {
            field: '__action',
            header: 'CONTENT_MANAGEMENT.TERMS_USE.TABLE.ACTION',
            class: 'text-top text-center',
            width: '4rem',
        }
    ],
    globalFilterFields: [
        'uniqId',
        'content',
        'status',
        'createdAt',
    ],
};
