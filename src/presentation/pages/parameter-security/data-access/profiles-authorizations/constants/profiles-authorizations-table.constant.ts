export const PROFILES_AUTHORIZATIONS_TABLE = {
    cols: [
        { field: '', header: '#', class: 'text-center' },
        {
            field: 'created_at',
            header: 'Date / Heure',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'nom',
            header: 'Nom du profil',
            class: 'text-center',
            width: '12rem',
        },
        {
            field: 'description',
            header: 'Description du profil',
            class: 'text-center',
            width: '12rem',
        },
        {
            field: 'statut',
            header: 'Statut',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'users_count',
            header: '# Uilisateurs',
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
        'nom',
        'description',
        'statut',
        'users_count',
        'updated_at',
    ],
};
