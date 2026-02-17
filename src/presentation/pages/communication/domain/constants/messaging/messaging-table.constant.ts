export const MESSAGING_TABLE = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'lastName',
            header: 'COMMUNICATION.MESSAGING.TABLE.SUBJECT',
            width: '10rem',
        },
        {
            field: 'firstName',
            header: 'COMMUNICATION.MESSAGING.TABLE.CONTENT',
            width: '12rem',
        },
        {
            field: 'email',
            header: 'COMMUNICATION.MESSAGING.TABLE.MESSAGE',
            width: '10rem',
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
