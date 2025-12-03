export const PROFILE_HABILITATION_TABLE = {
    cols: [
        {
            field: '__index',
            header: 'TABLE.COMMON.INDEX',
            class: 'text-center',
            width: '3rem',
        },
        {
            field: 'name',
            header: 'SETTINGS_SECURITY.PROFILE_HABILITATION.TABLE.PROFILE',
            class: 'text-center',
            width: '12rem',
        },
        {
            field: 'description',
            header: 'SETTINGS_SECURITY.PROFILE_HABILITATION.TABLE.DESCRIPTION',
            width: '20rem',
        },
        {
            field: 'createdAt',
            header: 'SETTINGS_SECURITY.PROFILE_HABILITATION.TABLE.CREATED_AT',
            class: 'text-center',
            width: '11rem',
        },
        {
            field: 'totalUsers',
            header: 'SETTINGS_SECURITY.PROFILE_HABILITATION.TABLE.USERS_COUNT',
            class: 'text-center',
            width: '10rem',
        },
        {
            field: 'status',
            header: 'SETTINGS_SECURITY.PROFILE_HABILITATION.TABLE.STATUT',
            class: 'text-center',
            width: '9rem',
        },
        {
            field: '__action',
            header: 'SETTINGS_SECURITY.PROFILE_HABILITATION.TABLE.ACTION',
            class: 'text-center',
            width: '9rem',
        },
    ],
    globalFilterFields: ['name', 'description', 'status'],
};
