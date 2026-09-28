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
            field: 'slaDescription',
            header: 'SLA.THRESHOLDS.TABLE.DESCRIPTION',
        },
        {
            class: 'text-center',
            field: 'delay',
            header: 'SLA.CHANNELS.TABLE.DELAY',
            width: '12rem',
        },
        {
            class: 'text-center',
            field: 'escalationDelay',
            header: 'SLA.CHANNELS.TABLE.ESCALATION_DELAY',
            width: '12rem',
        },
        {
            field: 'statusLabel',
            header: 'SLA.CHANNELS.TABLE.STATUS',
            class: 'text-center',
            width: '8rem',
        },
        // {
        //     class: 'text-center',
        //     field: 'createdAt',
        //     header: 'SLA.CHANNELS.TABLE.CREATED_AT',
        //     width: '10rem',
        // },
        {
            class: 'text-center',
            field: 'updatedAt',
            header: 'SLA.CHANNELS.TABLE.UPDATED_AT',
            width: '10rem',
        },
        {
            field: '__actionDropdown',
            header: 'SLA.CHANNELS.TABLE.ACTION',
            class: 'text-center',
            width: '8rem',
        },
    ],
    globalFilterFields: [
        'slaName',
        'slaDescription',
        'delay',
        'escalationDelay',
        'statusLabel',
    ],
};
