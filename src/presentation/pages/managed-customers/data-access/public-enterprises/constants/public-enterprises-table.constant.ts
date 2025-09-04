export const PUBLIC_ENTERPRISES_TABLE = {
    cols: [
        { field: '', header: '#', class: 'text-center' },
        {
            field: 'created_at',
            header: 'Date / Heure',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'code_client',
            header: 'Code',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'nom_client',
            header: 'Client',
            class: 'text-center',
            width: '12rem',
        },
        {
            field: 'compte_client',
            header: 'Compte client',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'statut',
            header: 'Statut',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'updated_at',
            header: 'Date Etat',
            class: 'text-center',
            width: '8rem',
        },
        { field: '', header: 'Actions', class: 'text-center', width: '16rem' },
    ],
    globalFilterFields: [
        'created_at',
        'code_client',
        'nom_client',
        'compte_client',
        'statut',
        'updated_at',
    ],
};
