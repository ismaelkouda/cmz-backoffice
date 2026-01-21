export const TASKS_TABLE_CONST = {
    cols: [
        {
            field: '__selection',
            header: 'COMMON.SELECTION',
            class: 'text-center',
            width: '2rem',
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
            width: '10rem',
        },
        {
            field: 'source',
            header: 'REPORTS_PROCESSING.TASKS.TABLE.SOURCE',
            width: '12rem',
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
            width: '5rem',
        },
    ],
    globalFilterFields: [
        'uniqId',
        'reportTypeLabel',
        'operatorsLabels',
        'sourceLabel',
        'createdAt',
    ],
};
