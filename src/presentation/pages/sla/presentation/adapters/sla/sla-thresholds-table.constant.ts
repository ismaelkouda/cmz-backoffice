export const SLA_THRESHOLDS_TABLE = {
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
        },
        {
            field: 'description',
            header: 'SLA.THRESHOLDS.TABLE.DESCRIPTION',
        },
        {
            field: 'reportSlasCount',
            header: 'SLA.THRESHOLDS.TABLE.REFERENTIALS',
            class: 'text-center',
            type: 'badge-button',
        },
        {
            class: 'text-center',
            field: 'createdAt',
            header: 'SLA.THRESHOLDS.TABLE.CREATED_AT',
        },
        {
            class: 'text-center',
            field: 'updatedAt',
            header: 'SLA.THRESHOLDS.TABLE.UPDATED_AT',
        },
    ],
    globalFilterFields: ['name', 'description'],
};
