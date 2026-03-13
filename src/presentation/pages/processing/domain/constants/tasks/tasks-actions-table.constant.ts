export const TASKS_ACTIONS_TABLE = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '3rem',
        },
        {
            field: 'date',
            header: 'PROCESSING.TASKS.ACTIONS.TABLE.DATE_ACTION',
            width: '12rem',
            class: 'text-center',
        },
        {
            field: 'type',
            header: 'PROCESSING.TASKS.ACTIONS.TABLE.TYPE',
            width: '12rem',
            class: 'text-center',
        },
        {
            field: 'description',
            header: 'PROCESSING.TASKS.ACTIONS.TABLE.DESCRIPTION',
            width: '12rem',
            class: 'text-left',
        },
        {
            field: 'createdBy',
            header: 'PROCESSING.TASKS.ACTIONS.TABLE.CREATED_BY',
            width: '12rem',
            class: 'text-center',
        },
        {
            field: 'createdAt',
            header: 'PROCESSING.TASKS.ACTIONS.TABLE.CREATED_AT',
            width: '12rem',
            class: 'date_width text-center',
        },
        {
            field: '__actionDropdown',
            header: 'PROCESSING.TASKS.ACTIONS.TABLE.ACTION',
            width: '6rem',
            class: 'text-center',
        },
    ],
    globalFilterFields: [
        'date',
        'type',
        'description',
        'createdBy',
        'createdAt',
    ],
};
