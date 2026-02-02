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
            header: 'REPORTS_REQUESTS.ALL.TABLE.UNIQ_ID',
            class: 'text-center',
            width: '7rem',
        },
        {
            field: 'reportType',
            header: 'REPORTS_REQUESTS.ALL.TABLE.REPORT_TYPE',
            width: '9rem',
        },
        {
            field: 'operators',
            header: 'REPORTS_REQUESTS.ALL.TABLE.OPERATORS',
            width: '8rem',
        },
        {
            field: 'source',
            header: 'REPORTS_REQUESTS.ALL.TABLE.SOURCE',
            width: '8rem',
        },
        {
            field: 'status',
            header: 'REPORTS_REQUESTS.ALL.TABLE.STATUS',
            class: 'text-center',
            width: '4rem',
        },
        {
            field: 'reportedAt',
            header: 'REPORTS_REQUESTS.ALL.TABLE.REPORTED_AT',
            class: 'text-center',
            width: '5rem',
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
        'reportType',
        'operators',
        'source',
        'status',
        'reportedAt',
    ],
};
