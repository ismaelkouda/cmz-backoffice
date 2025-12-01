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
            header: 'FINALIZATION.ALL.TABLE.UNIQ_ID',
            class: 'text-center',
            width: '10rem',
        },
        {
            field: 'reportType',
            header: 'FINALIZATION.ALL.TABLE.REPORT_TYPE',
            class: 'text-center',
            width: '12rem',
        },
        {
            field: 'operators',
            header: 'FINALIZATION.ALL.TABLE.OPERATORS',
            width: '13rem',
        },
        {
            field: 'source',
            header: 'FINALIZATION.ALL.TABLE.SOURCE',
            class: 'text-center',
            width: '9rem',
        },
        {
            field: 'state',
            header: 'FINALIZATION.ALL.TABLE.STATE',
            class: 'text-center',
            width: '9rem',
        },
        {
            field: 'createdAt',
            header: 'FINALIZATION.ALL.TABLE.CREATED_AT',
            class: 'text-center',
            width: '11rem',
        },
        {
            field: '__action',
            header: 'FINALIZATION.ALL.TABLE.ACTION',
            class: 'text-center',
            width: '6rem',
        },
    ],
    globalFilterFields: [
        'uniqId',
        'reportType',
        'operators',
        'source',
        'state',
        'createdAt',
        'placeDescription',
        'description',
    ],
};
