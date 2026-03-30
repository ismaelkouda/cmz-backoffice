export const NEWS_TABLE = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'type',
            header: 'CONTENT_MANAGEMENT.HOME.TABLE.TYPE',
            width: '2rem',
        },
        {
            field: 'title',
            header: 'CONTENT_MANAGEMENT.HOME.TABLE.TITLE',
            width: '17rem',
        },
        {
            field: 'statusLabel',
            header: 'CONTENT_MANAGEMENT.HOME.TABLE.STATUS',
            class: 'text-center',
            width: '3rem',
        },
        {
            field: 'createdAt',
            header: 'CONTENT_MANAGEMENT.HOME.TABLE.CREATED_AT',
            class: 'text-center',
            width: '3rem',
        },
        {
            field: '__actionDropdown',
            header: 'CONTENT_MANAGEMENT.HOME.TABLE.ACTION',
            class: 'text-center',
            width: '4rem',
        },
    ],
    globalFilterFields: ['id', 'type', 'title', 'statusLabel', 'createdAt'],
};
