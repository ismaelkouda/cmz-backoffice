export const QUEUES_TABLE_CONST = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
            type: 'selection',
        },
        {
            field: 'uniqId',
            header: 'REQUESTS.QUEUES.TABLE.UNIQ_ID',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'reportType',
            header: 'REQUESTS.QUEUES.TABLE.REPORT_TYPE',
            width: '11rem',
        },
        {
            field: 'operators',
            header: 'REQUESTS.QUEUES.TABLE.OPERATORS',
            width: '10rem',
        },
        {
            field: 'source',
            header: 'REQUESTS.QUEUES.TABLE.SOURCE',
            width: '12rem',
        },
        {
            field: 'reportedAt',
            header: 'REQUESTS.QUEUES.TABLE.CREATED_AT',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: '__action',
            header: 'REQUESTS.QUEUES.TABLE.ACTION',
            class: 'text-center',
            width: '2rem',
        },
    ],
    globalFilterFields: [
        'uniqId',
        'reportType',
        'operators',
        'source',
        'reportedAt',
    ],
};
