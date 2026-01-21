export const NOTIFICATIONS_TABLE_CONST = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '3rem',
        },
        {
            field: 'uniqId',
            header: 'COMMUNICATION.NOTIFICATIONS.TABLE.REFERENCE',
            class: 'text-center',
            width: '10rem',
        },
        {
            field: 'operation',
            header: 'COMMUNICATION.NOTIFICATIONS.TABLE.NOTIFICATION_TYPE',
            class: 'text-center',
            width: '12rem',
        },
        {
            field: 'description',
            header: 'COMMUNICATION.NOTIFICATIONS.TABLE.DESCRIPTION',
            class: 'text-center',
            width: '12rem',
        },
        {
            field: 'createdAt',
            header: 'COMMUNICATION.NOTIFICATIONS.TABLE.CREATED_AT',
            class: 'text-center',
            width: '11rem',
        },
        {
            field: '__action',
            header: 'COMMUNICATION.NOTIFICATIONS.TABLE.ACTION',
            class: 'text-center',
            width: '9rem',
        },
    ],
    globalFilterFields: ['reference', 'operation', 'description', 'created_at'],
};
