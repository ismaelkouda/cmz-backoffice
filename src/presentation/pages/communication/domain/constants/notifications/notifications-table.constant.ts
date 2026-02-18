export const NOTIFICATIONS_TABLE = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'name',
            header: 'COMMUNICATION.NOTIFICATIONS.TABLE.REFERENCE',
            width: '10rem',
        },
        {
            field: 'goalsSize',
            header: 'COMMUNICATION.NOTIFICATIONS.TABLE.TYPE',
            width: '18rem',
            type: 'number',
        },
        {
            field: 'achievementsSize',
            header: 'COMMUNICATION.NOTIFICATIONS.TABLE.DESCRIPTION',
            width: '18rem',
            type: 'number',
        },
        {
            field: 'createdAt',
            header: 'COMMUNICATION.NOTIFICATIONS.TABLE.CREATED_AT',
            class: 'text-center',
            width: '9rem',
        },
    ],
    globalFilterFields: [
        'name',
        'goalsSize',
        'achievementsSize',
        'percentages',
        'status',
        'createdAt',
    ],
};
