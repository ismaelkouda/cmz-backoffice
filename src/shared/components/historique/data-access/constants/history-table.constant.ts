export const historyTableConstant = {
    cols: [
        { field: '', header: '#', class: 'text-center' },
        {
            field: 'createdAt',
            header: 'Date / Heure',
            width: '12rem',
        },
        {
            field: 'typeAction',
            header: 'Operation',
            width: '13rem',
        },
        { field: 'action', header: 'Détails Operation', width: '27rem' },
        { field: 'source', header: 'Source [Utilisateur]', width: '27rem' },
        { field: '', header: 'Actions', class: 'text-center', width: '5rem' },
    ],
    globalFilterFields: ['createdAt', 'typeAction', 'action', 'source'],
};
