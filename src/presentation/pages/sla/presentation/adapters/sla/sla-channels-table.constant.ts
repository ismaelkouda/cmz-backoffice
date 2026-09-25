export const SLA_CHANNELS_TABLE = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'slaName',
            header: 'SLA.CHANNELS.TABLE.NAME',
        },
        {
            field: 'delay',
            header: 'SLA.CHANNELS.TABLE.DELAY',
        },
        {
            field: 'statusLabel',
            header: 'SLA.CHANNELS.TABLE.STATUS',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'createdAt',
            header: 'SLA.CHANNELS.TABLE.CREATED_AT',
        },
        {
            field: 'updatedAt',
            header: 'SLA.CHANNELS.TABLE.UPDATED_AT',
        },
        {
            field: '__actionDropdown',
            header: 'SLA.CHANNELS.TABLE.ACTION',
        },
    ],
    globalFilterFields: ['slaName', 'delay', 'statusLabel'],
};
