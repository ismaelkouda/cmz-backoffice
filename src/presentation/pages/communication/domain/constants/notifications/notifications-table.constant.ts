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
            header: 'COMMUNICATION.NOTIFICATIONS.TABLE.NAME',
            width: '10rem',
        },
        {
            field: 'goalsSize',
            header: 'COMMUNICATION.NOTIFICATIONS.TABLE.GOALS_SIZE',
            width: '18rem',
            type: 'number',
        },
        {
            field: 'achievementsSize',
            header: 'COMMUNICATION.NOTIFICATIONS.TABLE.ACHIEVEMENTS_SIZE',
            width: '18rem',
            type: 'number',
        },
        {
            field: 'percentages',
            header: 'COMMUNICATION.NOTIFICATIONS.TABLE.PERCENTAGES',
            width: '18rem',
        },
        {
            field: 'status',
            header: 'COMMUNICATION.NOTIFICATIONS.TABLE.STATUS',
            class: 'text-center',
            width: '5rem',
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
