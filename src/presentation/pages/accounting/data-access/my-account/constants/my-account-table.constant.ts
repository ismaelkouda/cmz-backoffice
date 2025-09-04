export const myAccountTableConstant = {
    cols: [
        { field: '', header: '#', class: 'text-center', width: '2rem' },
        {
            field: 'created_at',
            header: 'Date / Heure',
            class: 'text-center',
            width: '10rem',
        },
        {
            field: 'reference',
            header: 'N° Référence',
            class: 'text-center',
            width: '10rem',
        },
        { field: 'operation', header: 'Opération', width: '6rem' },
        {
            field: 'montant',
            header: 'Montant (Fcfa)',
            class: 'text-center',
            width: '6rem',
        },
        {
            field: 'solde_avant',
            header: 'Solde avant (Fcfa)',
            class: 'text-center',
            width: '6rem',
        },
        {
            field: 'solde_apres',
            header: 'Solde Après (Fcfa)',
            class: 'text-center',
            width: '6rem',
        },
    ],
    globalFilterFields: [
        'created_at',
        'reference',
        'operation',
        'montant',
        'solde_avant',
        'solde_apres',
        'statut',
        'updated_at',
    ],
};
