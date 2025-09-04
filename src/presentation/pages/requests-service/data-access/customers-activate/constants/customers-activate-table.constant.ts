export const CUSTOMERS_ACTIVATE_TABLE = {
    cols: [
        { field: '', header: '#', class: 'text-center' },
        {
            field: 'created_at',
            header: 'Date / Heure',
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
            header: 'Etape',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'traitement',
            header: 'Etat',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'updated_at',
            header: 'Date Etat',
            class: 'text-center',
            width: '8rem',
        },
        // {
        //   field: 'demandeur',
        //   header: 'Demandeur',
        //   class: 'text-center',
        //   width: '10rem',
        // },
        { field: '', header: 'Actions', class: 'text-center', width: '16rem' },
    ],
    globalFilterFields: [
        'created_at',
        'nom_client',
        'compte_client',
        'statut',
        'traitement',
        'updated_at',
        // 'demandeur',
    ],
};
