export const NEWSPAPERS_TABLE_CONST = {
    cols: [
        {
            field: '__index',
            header: 'TABLE.COMMON.INDEX',
            class: 'text-center',
            width: '3rem',
        },
        {
            field: 'uniqId',
            header: 'MANAGEMENT.NEWSPAPERS.TABLE.UNIQ_ID',
            class: 'text-center',
            width: '10rem',
        },
        {
            field: 'reportType',
            header: 'MANAGEMENT.NEWSPAPERS.TABLE.EVENT_TYPE',
            class: 'text-center',
            width: '12rem',
        },
        {
            field: 'operators',
            header: 'MANAGEMENT.NEWSPAPERS.TABLE.OPERATORS',
            width: '13rem',
        },
        {
            field: 'createdAt',
            header: 'MANAGEMENT.NEWSPAPERS.TABLE.CREATED_AT',
            class: 'text-center',
            width: '11rem',
        },
    ],
    globalFilterFields: [
        'uniqId',
        'reportType',
        'operators',
        'createdAt',
        'placeDescription',
        'description',
    ],
} as const;
