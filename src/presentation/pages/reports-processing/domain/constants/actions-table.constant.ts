export const ACTIONS_TABLE_CONST = {
    cols: [
        {
            field: '__index',
            header: 'TABLE.COMMON.INDEX',
            class: 'text-center',
            width: '3rem',
        },
        {
            field: 'date',
            header: 'ACTIONS.TABLE.DATE',
            width: '12rem',
            class: 'text-center',
        },
        {
            field: 'type',
            header: 'ACTIONS.TABLE.TYPE',
            width: '12rem',
            class: 'text-center',
        },
        {
            field: 'description',
            header: 'ACTIONS.TABLE.DESCRIPTION',
            width: '12rem',
            class: 'text-left',
        },
        {
            field: 'createdBy',
            header: 'ACTIONS.TABLE.CREATED_BY',
            width: '12rem',
            class: 'text-center',
        },
        {
            field: 'createdAt',
            header: 'ACTIONS.TABLE.CREATED_AT',
            width: '12rem',
            class: 'date_width text-center',
        },
        {
            field: '__action',
            header: 'ACTIONS.TABLE.ACTION',
            width: '6rem',
            class: 'text-center',
        },
    ],
    globalFilterFields: [
        'type',
        'description',
        'date',
        'createdBy',
        'createdAt',
    ],
};
