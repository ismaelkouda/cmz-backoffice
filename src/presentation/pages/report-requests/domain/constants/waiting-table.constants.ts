export const WAITING_TABLE_CONST = {
    cols: [
        {
            field: '__index',
            header: 'TABLE.COMMON.INDEX',
            class: 'text-center',
            width: '3rem',
        },
        {
            field: 'uniqId',
            header: 'REPORT_REQUESTS.WAITING.TABLE.UNIQ_ID',
            class: 'text-center',
            width: '10rem',
        },
        {
            field: 'reportType',
            header: 'REPORT_REQUESTS.WAITING.TABLE.REPORT_TYPE',
            class: 'text-center',
            width: '12rem',
        },
        {
            field: 'operators',
            header: 'REPORT_REQUESTS.WAITING.TABLE.OPERATORS',
            width: '13rem',
        },
        {
            field: 'status',
            header: 'REPORT_REQUESTS.WAITING.TABLE.STATUS',
            class: 'text-center',
            width: '9rem',
        },
        {
            field: 'createdAt',
            header: 'REPORT_REQUESTS.WAITING.TABLE.CREATED_AT',
            class: 'text-center',
            width: '11rem',
        },
        {
            field: '__action',
            header: 'REPORT_REQUESTS.WAITING.TABLE.ACTION',
            class: 'text-center',
            width: '6rem',
        },
    ],
    globalFilterFields: [
        'uniqId',
        'reportType',
        'operators',
        'state',
        'createdAt',
        'placeDescription',
        'description',
    ],
};
