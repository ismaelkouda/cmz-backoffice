export const TREATMENT_TABLE_CONST = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '3rem',
        },
        {
            field: 'uniqId',
            header: 'REPORTS_PROCESSING.TREATMENT.TABLE.UNIQ_ID',
            class: 'text-center',
            width: '10rem',
        },
        {
            field: 'reportType',
            header: 'REPORTS_PROCESSING.TREATMENT.TABLE.REPORT_TYPE',
            width: '12rem',
        },
        {
            field: 'operators',
            header: 'REPORTS_PROCESSING.TREATMENT.TABLE.OPERATORS',
            width: '13rem',
        },
        {
            field: 'state',
            header: 'REPORTS_PROCESSING.TREATMENT.TABLE.STATE',
            class: 'text-center',
            width: '9rem',
        },
        {
            field: 'createdAt',
            header: 'REPORTS_PROCESSING.TREATMENT.TABLE.CREATED_AT',
            class: 'text-center',
            width: '11rem',
        },
        {
            field: '__action',
            header: 'REPORTS_PROCESSING.TREATMENT.TABLE.ACTION',
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
