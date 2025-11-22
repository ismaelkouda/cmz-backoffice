export const NOTIFICATIONS_TABLE_CONST = {
    cols: [
        {
            field: '',
            header: '#',
            class: 'text-center',
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
            field: 'created_at',
            header: 'Date / Heure',
            class: 'text-center',
            width: '12rem',
        },
        {
            field: '',
            header: 'Actions',
            width: '4rem',
        },
    ],
    globalFilterFields: ['reference', 'operation', 'description', 'created_at'],
};
