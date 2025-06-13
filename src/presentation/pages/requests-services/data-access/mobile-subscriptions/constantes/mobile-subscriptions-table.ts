export const mobileSubscriptionsTableConstant = {
    cols: [
        { field: '', header: '#', class: 'text-center' },
        {
            field: 'created_at',
            header: 'Date / Heure',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'numero_demande',
            header: 'N° Dossier',
            class: 'text-center',
            width: '12rem',
        },
        {
            field: 'nb_demande_soumises',
            header: '# Lignes',
            class: 'text-center',
            width: '5rem',
        },
        {
            field: 'nb_demande_traitees',
            header: '# Traitées',
            class: 'text-center',
            width: '5rem',
        },
        // { field: 'nb_demande_identifiees', header: '# Identifiées', class: "text-center" },

        {
            field: 'statut',
            header: 'Etape',
            class: 'text-center',
            width: '6rem',
        },
        {
            field: 'traitement',
            header: 'Etat',
            class: 'text-center',
            width: '6rem',
        },
        {
            field: 'updated_at',
            header: 'Date Etat',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'demandeur',
            header: 'Demandeur',
            class: 'text-center',
            width: '16rem',
        },
        { field: '', header: 'Actions', class: 'text-center', width: '16rem' },
    ],
    globalFilterFields: [
        'created_at',
        'numero_demande',
        'nb_demande_soumises',
        'nb_demande_traitees',
        'statut',
        'traitement',
        'updated_at',
        'demandeur',
    ],
};
