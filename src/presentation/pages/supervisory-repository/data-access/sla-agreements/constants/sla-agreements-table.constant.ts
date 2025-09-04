export const SLA_AGREEMENTS_TABLE = {
    cols: [
        { field: '', header: '#', class: 'text-center' },
        {
            field: 'created_at',
            header: 'Date / Heure',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'nom_service',
            header: 'Nom du service',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'description',
            header: 'Description du service',
            class: 'text-center',
            width: '12rem',
        },
        {
            field: 'ack',
            header: 'Réception (h)',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'traitement',
            header: 'Traitement (h)',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'cloture',
            header: 'Clôture (h)',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'cloture',
            header: 'Escalade (h)',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'statut',
            header: 'Statut',
            class: 'text-center',
            width: '8rem',
        },
    ],
    globalFilterFields: [
        'created_at',
        'nom_service',
        'description',
        'ack',
        'traitement',
        'cloture',
        'escalade',
        'statut',
    ],
};
