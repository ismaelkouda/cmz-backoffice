export const NEWSPAPERS_TABLE_CONST = {
    cols: [
        {
            field: '__index',
            header: 'TABLE.COMMON.INDEX',
            class: 'text-center',
            width: '3rem',
        },
        {
            field: 'createdAt',
            header: 'MANAGEMENT.NEWSPAPERS.TABLE.CREATED_AT',
            class: 'text-center',
            width: '11rem',
        },
        {
            field: 'description',
            header: 'MANAGEMENT.NEWSPAPERS.TABLE.DESCRIPTION',
            class: 'text-center',
            width: '12rem',
        },
        {
            field: 'type',
            header: 'MANAGEMENT.NEWSPAPERS.TABLE.TYPE',
            width: '13rem',
        },
        /*  {
            field: '__action',
            header: 'MANAGEMENT.NEWSPAPERS.TABLE.ACTION',
            class: 'text-center',
            width: '6rem',
        }, */
    ],
    globalFilterFields: ['createdAt', 'description', 'type'],
} as const;
