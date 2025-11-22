export const QUEUES_TABLE_CONST = {
    cols: [
        {
            field: '__index',
            header: 'TABLE.COMMON.INDEX',
            class: 'text-center',
            width: '3rem',
        },
        {
            field: 'uniqId',
            header: 'REPORTS_REQUESTS.QUEUES.TABLE.UNIQ_ID',
            class: 'text-center',
            width: '10rem',
        },
        {
            field: 'reportType',
            header: 'REPORTS_REQUESTS.QUEUES.TABLE.REPORT_TYPE',
            class: 'text-center',
            width: '12rem',
        },
        {
            field: 'operators',
            header: 'REPORTS_REQUESTS.QUEUES.TABLE.OPERATORS',
            width: '13rem',
        },
        {
            field: 'source',
            header: 'REPORTS_REQUESTS.QUEUES.TABLE.SOURCE',
            class: 'text-center',
            width: '9rem',
        },
        {
            field: 'createdAt',
            header: 'REPORTS_REQUESTS.QUEUES.TABLE.CREATED_AT',
            class: 'text-center',
            width: '11rem',
        },
        {
            field: '__action',
            header: 'REPORTS_REQUESTS.QUEUES.TABLE.ACTION',
            class: 'text-center',
            width: '6rem',
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
