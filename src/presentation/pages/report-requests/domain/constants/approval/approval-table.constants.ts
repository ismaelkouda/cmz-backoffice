export const APPROVAL_TABLE_CONST = {
    cols: [
        {
            field: '__index',
            header: 'TABLE.COMMON.INDEX',
            class: 'text-center',
            width: '3rem',
        },
        {
            field: 'uniqId',
            header: 'REPORT_REQUESTS.APPROVAL.TABLE.UNIQ_ID',
            class: 'text-center',
            width: '10rem',
        },
        {
            field: 'reportType',
            header: 'REPORT_REQUESTS.APPROVAL.TABLE.REPORT_TYPE',
            width: '12rem',
        },
        {
            field: 'operators',
            header: 'REPORT_REQUESTS.APPROVAL.TABLE.OPERATORS',
            width: '13rem',
        },
        {
            field: 'state',
            header: 'REPORT_REQUESTS.APPROVAL.TABLE.STATE',
            class: 'text-center',
            width: '9rem',
        },
        {
            field: 'submissionState',
            header: 'REPORT_REQUESTS.APPROVAL.TABLE.STEP',
            class: 'text-center',
            width: '9rem',
        },
        {
            field: 'createdAt',
            header: 'REPORT_REQUESTS.APPROVAL.TABLE.CREATED_AT',
            class: 'text-center',
            width: '11rem',
        },
        {
            field: '__action',
            header: 'REPORT_REQUESTS.APPROVAL.TABLE.ACTION',
            class: 'text-center',
            width: '6rem',
        },
    ],
    globalFilterFields: [
        'uniqId',
        'reportType',
        'operators',
        'state',
        'submissionState',
        'createdAt',
        'placeDescription',
        'description',
    ],
};
