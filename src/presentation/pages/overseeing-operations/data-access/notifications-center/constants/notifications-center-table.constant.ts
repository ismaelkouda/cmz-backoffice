export const notificationsCenterTableConstant = {
    cols: [
        {
            field: '',
            header: '#',
            class: 'text-center',
        },
        {
            field: 'created_at',
            header: 'Date / Heure',
            class: 'text-center',
            width: '12rem',
        },
        {
            field: 'reference',
            header: 'Reference',
            class: 'text-center',
            width: '10rem',
        },
        {
            field: 'operation',
            header: 'Type Notification',
            class: 'text-center',
            width: '12rem',
        },
        {
            field: 'description',
            header: 'Description',
        },
        {
            field: '',
            header: 'Actions',
            width: '4rem',
        },
    ],
    globalFilterFields: ['created_at', 'reference', 'operation', 'description'],
};
