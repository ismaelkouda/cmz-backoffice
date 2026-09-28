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
            width: '14rem',
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
            width: '12rem',
        },
        // {
        //     class: 'text-center',
        //     field: 'createdAt',
        //     header: 'SLA.THRESHOLDS.TABLE.CREATED_AT',
        //     width: '10rem',
        // },
        // {
        //     class: 'text-center',
        //     field: 'updatedAt',
        //     header: 'SLA.THRESHOLDS.TABLE.UPDATED_AT',
        //     width: '10rem',
        // },
    ],
    globalFilterFields: ['name', 'description'],
};
