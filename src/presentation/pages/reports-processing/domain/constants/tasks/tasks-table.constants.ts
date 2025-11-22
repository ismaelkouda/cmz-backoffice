export const TASKS_TABLE_CONST = {
    cols: [
        {
            field: '__selection',
            header: 'TABLE.COMMON.SELECTION',
            class: 'text-center',
            width: '4rem',
            type: 'selection',
        },
        {
            field: 'uniqId',
            header: 'REPORTS_PROCESSING.TASKS.TABLE.UNIQ_ID',
            class: 'text-center',
            width: '10rem',
        },
        {
            field: 'reportType',
            header: 'REPORTS_PROCESSING.TASKS.TABLE.REPORT_TYPE',
            class: 'text-center',
            width: '12rem',
        },
        {
            field: 'operators',
            header: 'REPORTS_PROCESSING.TASKS.TABLE.OPERATORS',
            width: '13rem',
        },
        {
            field: 'status',
            header: 'REPORTS_PROCESSING.TASKS.TABLE.STATUS',
            class: 'text-center',
            width: '9rem',
        },
        {
            field: 'createdAt',
            header: 'REPORTS_PROCESSING.TASKS.TABLE.CREATED_AT',
            class: 'text-center',
            width: '11rem',
        },
        {
            field: '__action',
            header: 'REPORTS_PROCESSING.TASKS.TABLE.ACTION',
            class: 'text-center',
            width: '6rem',
        },
    ],
    globalFilterFields: [
        'uniqId',
        'reportType',
        'operators',
        'state',
        'createdAt',
        'placeDescription',
        'description',
    ],
};
