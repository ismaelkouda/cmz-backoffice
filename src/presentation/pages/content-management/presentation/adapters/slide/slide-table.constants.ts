export const SLIDE_TABLE = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '3rem',
        },
        {
            field: 'type',
            header: 'CONTENT_MANAGEMENT.SLIDE.TABLE.TYPE',
            width: '3rem',
        },
        {
            field: 'title',
            header: 'CONTENT_MANAGEMENT.SLIDE.TABLE.TITLE',
            width: '8rem',
        },
        {
            field: 'subtitle',
            header: 'CONTENT_MANAGEMENT.SLIDE.TABLE.SUBTITLE',
            width: '17rem',
        },
        {
            field: 'platforms',
            header: 'CONTENT_MANAGEMENT.SLIDE.TABLE.PLATFORM',
            width: '8rem',
        },
        {
            field: 'statusLabel',
            header: 'CONTENT_MANAGEMENT.SLIDE.TABLE.STATUS',
            class: 'text-center',
            width: '5rem',
        },
        {
            field: 'createdAt',
            header: 'CONTENT_MANAGEMENT.SLIDE.TABLE.CREATED_AT',
            class: 'text-center',
            width: '5rem',
        },
        {
            field: '__actionDropdown',
            header: 'CONTENT_MANAGEMENT.SLIDE.TABLE.ACTION',
            class: 'text-center',
            width: '4rem',
        },
    ],
    globalFilterFields: [
        'id',
        'type',
        'title',
        'subtitle',
        'platforms',
        'statusLabel',
        'createdAt',
    ],
};
