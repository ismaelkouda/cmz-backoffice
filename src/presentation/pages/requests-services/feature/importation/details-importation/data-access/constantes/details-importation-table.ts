export const DetailsImportationTableConstant = {
    cols: [
        { field: '', header: '#', class: 'text-center' },
        {
            field: 'created_at',
            header: 'Date / Heure',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'transaction',
            header: 'N° Transaction',
            class: 'text-center',
            width: '12rem',
        },
        {
            field: 'imsi',
            header: 'IMSI',
            class: 'text-center',
            width: '6rem',
        },
        {
            field: 'msisdn',
            header: 'MSISDN',
            class: 'text-center',
            width: '6rem',
        },
        {
            field: 'statut',
            header: 'Etape',
            class: 'text-center',
            width: '6rem',
        },
        {
            field: '',
            header: 'Actions',
            class: 'text-center',
            width: '10rem',
        },
    ],
    globalFilterFields: [
        'created_at',
        'transaction',
        'imsi',
        'msisdn',
        'statut',
    ],
};
