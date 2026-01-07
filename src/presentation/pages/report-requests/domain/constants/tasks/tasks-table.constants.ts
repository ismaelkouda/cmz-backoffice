export const TASKS_TABLE_CONST = {
    cols: [
        {
            field: '__index',
            header: 'TABLE.COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'uniqId',
            header: 'REPORTS_REQUESTS.TASKS.TABLE.UNIQ_ID',
            class: 'text-center',
            width: '10rem',
        },
        {
            field: 'reportType',
            header: 'REPORTS_REQUESTS.TASKS.TABLE.REPORT_TYPE',
            width: '11rem',
        },
        {
            field: 'operators',
            header: 'REPORTS_REQUESTS.TASKS.TABLE.OPERATORS',
            width: '10rem',
        },
        {
            field: 'source',
            header: 'REPORTS_REQUESTS.TASKS.TABLE.SOURCE',
            width: '12rem',
        },
        {
            field: 'reportedAt',
            header: 'REPORTS_REQUESTS.TASKS.TABLE.CREATED_AT',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: '__action',
            header: 'REPORTS_REQUESTS.TASKS.TABLE.ACTION',
            class: 'text-center',
            width: '2rem',
        },
    ],
    globalFilterFields: [
        'uniqId',
        'reportTypeLabel',
        'operatorsLabels',
        'sourceLabel',
        'reportedAt',
    ],
};
