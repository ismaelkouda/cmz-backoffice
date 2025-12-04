export const TASKS_TABLE_CONST = {
    cols: [
        {
            field: '__index',
            header: 'TABLE.COMMON.INDEX',
            class: 'text-center',
            width: '3rem',
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
            width: '12rem',
        },
        {
            field: 'operators',
            header: 'REPORTS_REQUESTS.TASKS.TABLE.OPERATORS',
            width: '13rem',
        },
        {
            field: 'source',
            header: 'REPORTS_REQUESTS.TASKS.TABLE.SOURCE',
            class: 'text-center',
            width: '9rem',
        },
        {
            field: 'createdAt',
            header: 'REPORTS_REQUESTS.TASKS.TABLE.CREATED_AT',
            class: 'text-center',
            width: '11rem',
        },
        {
            field: '__action',
            header: 'REPORTS_REQUESTS.TASKS.TABLE.ACTION',
            class: 'text-center',
            width: '4rem',
        },
    ],
    globalFilterFields: [
        'uniqId',
        'reportType',
        'operators',
        'source',
        'createdAt',
        'placeDescription',
        'description',
    ],
};
