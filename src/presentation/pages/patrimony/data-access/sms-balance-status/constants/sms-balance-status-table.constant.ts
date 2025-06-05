export const smsBalanceStatusTableConstant = {
    cols: [
        { field: '', header: '#', class: 'text-center', width: '2rem' },
        { field: 'niveau_uns_nom', header: 'Niveau un', width: '10rem' },
        { field: 'niveau_deux_nom', header: 'Niveau deux', width: '10rem' },
        { field: 'niveau_trois_nom', header: 'Niveau trois', width: '10rem' },
        { field: 'apn', header: 'APN', class: 'text-center', width: '6rem' },
        {
            field: 'point_emplacement',
            header: 'Nom Emplacement',
            width: '10rem',
        },
        {
            field: 'msisdn',
            header: 'MSISDN',
            class: 'text-center',
            width: '6rem',
        },
        { field: 'imsi', header: 'IMSI', class: 'text-center', width: '6rem' },
        {
            field: 'solde_sms',
            header: 'Solde SMS',
            class: 'text-center',
            width: '6rem',
        },
        {
            field: 'updated_at',
            header: 'Date Solde',
            class: 'text-center',
            width: '6rem',
        },
    ],
    globalFilterFields: [
        'niveau_uns_nom',
        'niveau_deux_nom',
        'niveau_trois_nom',
        'apn',
        'point_emplacement',
        'msisdn',
        'imsi',
        'solde_actuel_go',
        'updated_at',
    ],
};
