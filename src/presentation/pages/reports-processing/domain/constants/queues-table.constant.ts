export const QUEUES_TABLE_CONST = {
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
            header: 'REPORTS_PROCESSING.QUEUES.TABLE.UNIQ_ID',
            class: 'text-center',
            width: '10rem',
        },
        {
            field: 'reportType',
            header: 'REPORTS_PROCESSING.QUEUES.TABLE.REPORT_TYPE',
            class: 'text-center',
            width: '12rem',
        },
        {
            field: 'operators',
            header: 'REPORTS_PROCESSING.QUEUES.TABLE.OPERATORS',
            width: '13rem',
        },
        {
            field: 'createdAt',
            header: 'REPORTS_PROCESSING.QUEUES.TABLE.CREATED_AT',
            class: 'text-center',
            width: '11rem',
        },
        {
            field: '__action',
            header: 'REPORTS_PROCESSING.QUEUES.TABLE.ACTION',
            class: 'text-center',
            width: '9rem',
        },
    ],
    globalFilterFields: [
        'uniqId',
        'reportType',
        'operators',
        'createdAt',
        'placeDescription',
        'description',
    ],
} as const;
