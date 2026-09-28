export const SLA_SYSTEM_THRESHOLDS_TABLE = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'name',
            header: 'SLA.THRESHOLDS.TABLE.NAME',
            width: '14rem',
        },
        {
            field: 'description',
            header: 'SLA.THRESHOLDS.TABLE.DESCRIPTION',
        },
        {
            field: 'statusLabel',
            header: 'SLA.SLA_LIST.TABLE.STATUS',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: '__actionDropdown',
            header: 'SLA.SLA_LIST.TABLE.ACTION',
            class: 'text-center',
            width: '8rem',
        },
    ],
    globalFilterFields: ['name', 'description', 'statusLabel'],
};
