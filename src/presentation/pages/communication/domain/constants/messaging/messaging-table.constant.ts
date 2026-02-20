export const MESSAGING_TABLE = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'type',
            header: 'COMMUNICATION.MESSAGING.TABLE.TYPE',
            width: '10rem',
        },
        {
            field: 'subject',
            header: 'COMMUNICATION.MESSAGING.TABLE.SUBJECT',
            width: '10rem',
        },
        {
            field: 'content',
            header: 'COMMUNICATION.MESSAGING.TABLE.CONTENT',
            width: '12rem',
        },
        {
            field: 'ceratedAt',
            header: 'COMMUNICATION.MESSAGING.TABLE.CREATED_AT',
            class: 'text-center',
            width: '7rem',
        },
    ],
    globalFilterFields: ['subject', 'content', 'message', 'createdAt'],
};
