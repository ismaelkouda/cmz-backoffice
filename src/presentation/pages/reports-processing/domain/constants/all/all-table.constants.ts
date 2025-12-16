export const ALL_TABLE_CONST = {
    cols: [
        {
            field: '__index',
            header: 'TABLE.COMMON.INDEX',
            class: 'text-center',
            width: '3rem',
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
            width: '11rem',
        },
        {
            field: 'operators',
            header: 'REPORTS_REQUESTS.ALL.TABLE.OPERATORS',
            width: '11rem',
        },
        {
            field: 'source',
            header: 'REPORTS_REQUESTS.ALL.TABLE.SOURCE',
            class: 'text-center',
            width: '13rem',
        },
        {
            field: 'state',
            header: 'REPORTS_REQUESTS.ALL.TABLE.STATE',
            class: 'text-center',
            width: '6rem',
        },
        {
            field: 'createdAt',
            header: 'REPORTS_REQUESTS.ALL.TABLE.CREATED_AT',
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
        'createdAt',
    ],
};
