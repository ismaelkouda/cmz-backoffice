export const QUEUES_TABLE_CONST = {
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
            width: '11rem',
        },
        {
            field: 'source',
            header: 'REPORTS_PROCESSING.QUEUES.TABLE.SOURCE',
            class: 'text-center',
            width: '13rem',
        },
        {
            field: 'createdAt',
            header: 'REPORTS_PROCESSING.QUEUES.TABLE.CREATED_AT',
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
        'createdAt'
    ],
};
