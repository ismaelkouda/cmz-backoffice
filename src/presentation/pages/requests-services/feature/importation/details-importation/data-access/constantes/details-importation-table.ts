export const DetailsImportationTableConstant = {
    cols: [
        { field: '', header: '#', class: 'text-center' },
        {
            field: 'created_at',
            header: 'Date / Heure',
            class: 'text-center',
            width: '6rem',
        },
        {
            field: 'transaction',
            header: 'N° Transaction',
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
            field: 'imsi',
            header: 'IMSI',
            class: 'text-center',
            width: '6rem',
        },
        {
            field: 'iccid',
            header: 'ICCID',
            class: 'text-center',
            width: '14rem',
        },
        {
            field: 'apn',
            header: 'APN',
            class: 'text-center',
            width: '4rem',
        },
        {
            field: 'message',
            header: 'Message',
            class: 'text-center',
            width: '6rem',
        },
        {
            field: 'statut',
            header: 'Statut',
            class: 'text-center',
            width: '4rem',
        },
    ],
    globalFilterFields: [
        'created_at',
        'transaction',
        'imsi',
        'msisdn',
        'statut',
        'message',
    ],
};
