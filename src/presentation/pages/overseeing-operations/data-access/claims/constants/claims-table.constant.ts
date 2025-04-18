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
            field: 'numero_demande',
            header: 'N° Dossier',
            class: 'text-center',
            width: '12rem',
        },
        {
            field: 'nb_demande_soumises',
            header: '# Lignes',
            class: 'text-center',
        },
        {
            field: 'nb_demande_traitees',
            header: '# Traitées',
            class: 'text-center',
        },
        // { field: 'nb_demande_identifiees', header: '# Identifiées', class: "text-center" },
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
        'numero_demande',
        'nb_demande_soumises',
        'nb_demande_traitees',
        'statut',
        'traitement',
        'updated_at',
        'demandeur',
    ],
};
