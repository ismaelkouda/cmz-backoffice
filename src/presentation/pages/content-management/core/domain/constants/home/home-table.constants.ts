export const HOME_TABLE_CONST = {
    cols: [
        {
            field: '__reorder',
            header: 'TABLE.COMMON.INDEX',
            class: 'text-center',
            width: '3rem',
        },
        {
            field: 'type',
            header: 'CONTENT_MANAGEMENT.HOME.TABLE.TYPE',
            width: '3rem',
        },
        {
            field: 'title',
            header: 'CONTENT_MANAGEMENT.HOME.TABLE.TITLE',
            width: '8rem',
        },
        {
            field: 'platforms',
            header: 'CONTENT_MANAGEMENT.HOME.TABLE.PLATEFORM',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'status',
            header: 'CONTENT_MANAGEMENT.HOME.TABLE.STATUS',
            class: 'text-center',
            width: '5rem',
        },
        {
            field: 'createdAt',
            header: 'CONTENT_MANAGEMENT.HOME.TABLE.CREATED_AT',
            class: 'text-center',
            width: '5rem',
        },
        {
            field: '__action',
            header: 'CONTENT_MANAGEMENT.HOME.TABLE.ACTION',
            class: 'text-center',
            width: '4rem',
        },
    ],
    globalFilterFields: [
        'id',
        'type',
        'title',
        'platforms',
        'order',
        'status',
        'createdAt',
    ],
};
