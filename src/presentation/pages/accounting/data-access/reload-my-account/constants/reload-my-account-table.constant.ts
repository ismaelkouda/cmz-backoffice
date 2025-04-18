export const reloadMyAccountTableConstant = {
    cols: [
        { field: '', header: '#', class: 'text-center', width: '2rem' },
        {
            field: 'created_at',
            header: 'Date / Heure',
            class: 'text-center',
            width: '10rem',
        },
        {
            field: 'transaction',
            header: 'N° Transaction',
            class: 'text-center',
            width: '10rem',
        },
        {
            field: 'montant',
            header: 'Montant (Fcfa)',
            class: 'text-center',
            width: '6rem',
        },
        {
            field: 'statut',
            header: 'Statut',
            class: 'text-center',
            width: '4rem',
        },
        {
            field: 'updated_at',
            header: 'Date MAJ',
            class: 'text-center',
            width: '12rem',
        },
        { field: '', header: 'Actions', class: 'text-center', width: '4rem' },
    ],
    globalFilterFields: [
        'created_at',
        'transaction',
        'montant',
        'solde_avant',
        'solde_apres',
        'statut',
        'updated_at',
    ],
};
