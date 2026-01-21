export const HOME_TABLE_CONST = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'title',
            header: 'CONTENT_MANAGEMENT.HOME.TABLE.TITLE',
            width: '17rem',
        },
        {
            field: 'platforms',
            header: 'CONTENT_MANAGEMENT.HOME.TABLE.PLATFORM',
            width: '6rem',
        },
        {
            field: 'status',
            header: 'CONTENT_MANAGEMENT.HOME.TABLE.STATUS',
            class: 'text-center',
            width: '3rem',
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
        'title',
        'platforms',
        'order',
        'status',
        'createdAt',
    ],
};
