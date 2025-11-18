export const FINALIZE_TABLE_CONST = {
    cols: [
        {
            field: '__index',
            header: 'TABLE.COMMON.INDEX',
            class: 'text-center',
            width: '3rem',
        },
        {
            field: 'uniqId',
            header: 'REPORT_PROCESSING.FINALIZE.TABLE.UNIQ_ID',
            class: 'text-center',
            width: '10rem',
        },
        {
            field: 'reportType',
            header: 'REPORT_PROCESSING.FINALIZE.TABLE.REPORT_TYPE',
            width: '12rem',
        },
        {
            field: 'operators',
            header: 'REPORT_PROCESSING.FINALIZE.TABLE.OPERATORS',
            width: '13rem',
        },
        {
            field: 'state',
            header: 'REPORT_PROCESSING.FINALIZE.TABLE.STATE',
            class: 'text-center',
            width: '9rem',
        },
        {
            field: 'createdAt',
            header: 'REPORT_PROCESSING.FINALIZE.TABLE.CREATED_AT',
            class: 'text-center',
            width: '11rem',
        },
        {
            field: '__action',
            header: 'REPORT_PROCESSING.FINALIZE.TABLE.ACTION',
            class: 'text-center',
            width: '9rem',
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
