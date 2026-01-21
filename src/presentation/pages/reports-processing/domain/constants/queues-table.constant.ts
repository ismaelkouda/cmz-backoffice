export const QUEUES_TABLE_CONST = {
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
            header: 'REPORTS_PROCESSING.QUEUES.TABLE.UNIQ_ID',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'reportType',
            header: 'REPORTS_PROCESSING.QUEUES.TABLE.REPORT_TYPE',
            width: '11rem',
        },
        {
            field: 'operators',
            header: 'REPORTS_PROCESSING.QUEUES.TABLE.OPERATORS',
            width: '10rem',
        },
        {
            field: 'source',
            header: 'REPORTS_PROCESSING.QUEUES.TABLE.SOURCE',
            width: '12rem',
        },
        {
            field: 'reportedAt',
            header: 'REPORTS_PROCESSING.QUEUES.TABLE.REPORTED_AT',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: '__action',
            header: 'REPORTS_PROCESSING.QUEUES.TABLE.ACTION',
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
