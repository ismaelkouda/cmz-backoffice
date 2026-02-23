export const NOTIFICATIONS = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'reference',
            header: 'COMMUNICATION.NOTIFICATIONS.TABLE.REFERENCE',
            width: '8rem',
        },
        {
            field: 'title',
            header: 'COMMUNICATION.NOTIFICATIONS.TABLE.TITLE',
            width: '18rem',
        },
        {
            field: 'message',
            header: 'COMMUNICATION.NOTIFICATIONS.TABLE.MESSAGE',
            width: '20rem',
        },
        {
            field: 'status',
            header: 'COMMUNICATION.NOTIFICATIONS.TABLE.STATUS',
            class: 'text-center',
            width: '5rem',
        },
        {
            field: 'sendAt',
            header: 'COMMUNICATION.NOTIFICATIONS.TABLE.SEND_AT',
            class: 'text-center',
            width: '8rem',
        },
    ],
    globalFilterFields: ['reference', 'title', 'message', 'sendAt'],
};
