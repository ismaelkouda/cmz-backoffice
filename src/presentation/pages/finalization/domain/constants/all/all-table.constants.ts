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
            header: 'FINALIZATION.ALL.TABLE.UNIQ_ID',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'reportType',
            header: 'FINALIZATION.ALL.TABLE.REPORT_TYPE',
            width: '12rem',
        },
        {
            field: 'operators',
            header: 'FINALIZATION.ALL.TABLE.OPERATORS',
            width: '12rem',
        },
        {
            field: 'source',
            header: 'FINALIZATION.ALL.TABLE.SOURCE',
            width: '12rem',
        },
        {
            field: 'state',
            header: 'FINALIZATION.ALL.TABLE.STATE',
            class: 'text-center',
            width: '4rem',
        },
        {
            field: 'createdAt',
            header: 'FINALIZATION.ALL.TABLE.CREATED_AT',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: '__action',
            header: 'FINALIZATION.ALL.TABLE.ACTION',
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
