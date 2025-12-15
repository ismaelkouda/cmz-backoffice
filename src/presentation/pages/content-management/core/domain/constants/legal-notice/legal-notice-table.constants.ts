export const LEGAL_NOTICE_TABLE_CONST = {
    cols: [
        {
            field: '__index',
            header: 'TABLE.COMMON.INDEX',
            class: 'text-top text-center',
            width: '2rem',
        },
        {
            field: 'content',
            header: 'CONTENT_MANAGEMENT.LEGAL_NOTICE.TABLE.CONTENT',
            width: '35rem',
        },
        {
            field: 'status',
            header: 'CONTENT_MANAGEMENT.LEGAL_NOTICE.TABLE.STATE',
            class: 'text-top text-center',
            width: '4rem',
        },
        {
            field: 'createdAt',
            header: 'CONTENT_MANAGEMENT.LEGAL_NOTICE.TABLE.CREATED_AT',
            class: 'text-center text-top',
            width: '4rem',
        },
        {
            field: '__action',
            header: 'CONTENT_MANAGEMENT.LEGAL_NOTICE.TABLE.ACTION',
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
