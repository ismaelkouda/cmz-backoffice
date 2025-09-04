export const claimsTableConstant = {
    cols: [
        { field: '', header: '#', class: 'text-center', width: '2rem' },
        {
            field: 'created_at',
            header: 'Date / Heure',
            class: 'text-center',
            width: '12rem',
        },
        {
            field: 'reference',
            header: 'N° Référence',
            class: 'text-center',
        },
        {
            field: 'operation',
            header: 'Opération',
        },
        { field: 'statut', header: 'Etape', class: 'text-center' },
        { field: 'traitement', header: 'Etat', class: 'text-center' },
        {
            field: 'updated_at',
            header: 'Date Etat',
            class: 'text-center',
            width: '12rem',
        },
        { field: 'demandeur', header: 'Demandeur', class: 'text-center' },
        {
            field: '',
            header: 'Actions',
            class: 'text-center',
            width: 'fix-content',
        },
    ],
    globalFilterFields: [
        'created_at',
        'reference',
        'operation',
        'statut',
        'updated_at',
        'demandeur',
    ],
};
