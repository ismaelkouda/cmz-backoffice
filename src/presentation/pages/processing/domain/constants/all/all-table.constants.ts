export const ALL_TABLE_CONST = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'uniqId',
            header: 'PROCESSING.ALL.TABLE.UNIQ_ID',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'reportType',
            header: 'PROCESSING.ALL.TABLE.REPORT_TYPE',
            width: '12rem',
        },
        {
            field: 'operators',
            header: 'PROCESSING.ALL.TABLE.OPERATORS',
            width: '12rem',
        },
        {
            field: 'source',
            header: 'PROCESSING.ALL.TABLE.SOURCE',
            width: '12rem',
        },
        {
            field: 'state',
            header: 'PROCESSING.ALL.TABLE.STATE',
            class: 'text-center',
            width: '4rem',
        },
        {
            field: 'reportedAt',
            header: 'PROCESSING.ALL.TABLE.REPORTED_AT',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: '__action',
            header: 'PROCESSING.ALL.TABLE.ACTION',
            class: 'text-center',
            width: '2rem',
        },
    ],
    globalFilterFields: [
        'uniqId',
        'reportTypeLabel',
        'operatorsLabels',
        'sourceLabel',
        'state',
        'reportedAt',
    ],
};
