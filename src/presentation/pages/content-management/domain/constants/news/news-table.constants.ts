export const NEWS_TABLE = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        // {
        //     field: 'type',
        //     header: 'CONTENT_MANAGEMENT.NEWS.TABLE.TYPE',
        //     width: '2rem',
        // },
        {
            field: 'title',
            header: 'CONTENT_MANAGEMENT.NEWS.TABLE.TITLE',
            width: '15rem',
        },
        {
            field: 'category',
            header: 'CONTENT_MANAGEMENT.NEWS.TABLE.CATEGORY',
            width: '4rem',
        },
        {
            field: 'subCategory',
            header: 'CONTENT_MANAGEMENT.NEWS.TABLE.SUB_CATEGORY',
            width: '12rem',
        },
        {
            field: 'statusLabel',
            header: 'CONTENT_MANAGEMENT.NEWS.TABLE.STATUS',
            class: 'text-center',
            width: '3rem',
        },
        {
            field: 'createdAt',
            header: 'CONTENT_MANAGEMENT.NEWS.TABLE.CREATED_AT',
            class: 'text-center',
            width: '5rem',
        },
        {
            field: '__actionDropdown',
            header: 'CONTENT_MANAGEMENT.NEWS.TABLE.ACTION',
            class: 'text-center',
            width: '3rem',
        },
    ],
    globalFilterFields: [
        'id',
        'title',
        'category',
        'subCategory',
        'statusLabel',
        'createdAt',
    ],
};
