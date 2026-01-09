export const ALL_TABLE_CONST = {
    cols: [
        {
            field: '__index',
            header: 'TABLE.COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'uniqId',
            header: 'REPORTS_REQUESTS.ALL.TABLE.UNIQ_ID',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'reportType',
            header: 'REPORTS_REQUESTS.ALL.TABLE.REPORT_TYPE',
            width: '12rem',
        },
        {
            field: 'operators',
            header: 'REPORTS_REQUESTS.ALL.TABLE.OPERATORS',
            width: '12rem',
        },
        {
            field: 'source',
            header: 'REPORTS_REQUESTS.ALL.TABLE.SOURCE',
            width: '12rem',
        },
        {
            field: 'state',
            header: 'REPORTS_REQUESTS.ALL.TABLE.STATE',
            class: 'text-center',
            width: '4rem',
        },
        {
            field: 'reportedAt',
            header: 'REPORTS_REQUESTS.ALL.TABLE.REPORTED_AT',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: '__action',
            header: 'REPORTS_REQUESTS.ALL.TABLE.ACTION',
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
