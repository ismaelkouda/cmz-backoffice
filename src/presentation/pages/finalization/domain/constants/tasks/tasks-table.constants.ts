export const TASKS_TABLE_CONST = {
    cols: [
        {
            field: '__selection',
            header: 'TABLE.COMMON.SELECTION',
            class: 'text-center',
            width: '3rem',
            type: 'selection',
        },
        {
            field: 'uniqId',
            header: 'REPORTS_PROCESSING.TASKS.TABLE.UNIQ_ID',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'reportType',
            header: 'REPORTS_PROCESSING.TASKS.TABLE.REPORT_TYPE',
            width: '11rem',
        },
        {
            field: 'operators',
            header: 'REPORTS_PROCESSING.TASKS.TABLE.OPERATORS',
            width: '11rem',
        },
        {
            field: 'source',
            header: 'REPORTS_PROCESSING.TASKS.TABLE.SOURCE',
            class: 'text-center',
            width: '13rem',
        },
        {
            field: 'createdAt',
            header: 'REPORTS_PROCESSING.TASKS.TABLE.CREATED_AT',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: '__action',
            header: 'REPORTS_PROCESSING.TASKS.TABLE.ACTION',
            class: 'text-center',
            width: '3rem',
        },
    ],
    globalFilterFields: [
        'uniqId',
        'reportType',
        'operators',
        'source',
        'createdAt',
    ],
};
