export const SLA_ALERT_CHANNEL_TABLE = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'type',
            header: 'SLA.ALERT_CHANNEL.TABLE.TYPE',
            width: '16rem',
        },
        ...(['email', 'sms', 'whatsapp', 'telegram'] as const).map((field) => ({
            field,
            type: 'checkbox',
            header: `SLA.ALERT_CHANNEL.TABLE.${field.toUpperCase()}`,
            width: '8rem',
            class: 'text-center',
            editor: {
                type: 'checkbox' as const,
                modelField: field,
            },
        })),
        {
            field: '__action',
            header: 'SLA.ALERT_CHANNEL.TABLE.ACTION',
            class: 'text-center',
            width: '7rem',
        },
    ],
    globalFilterFields: ['type'],
};
