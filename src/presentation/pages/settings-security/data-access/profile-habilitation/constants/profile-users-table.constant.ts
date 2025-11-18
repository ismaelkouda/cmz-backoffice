export const PROFILE_USERS_TABLE = {
    cols: [
        {
            field: '__index',
            header: 'TABLE.COMMON.INDEX',
            class: 'text-center',
            width: '3rem',
        },
        {
            field: 'matricule',
            header: 'SETTINGS_SECURITY.USER.TABLE.MATRICULE',
            class: 'text-center',
            width: '10rem',
        },
        {
            field: 'fullName',
            header: 'SETTINGS_SECURITY.USER.TABLE.FULL_NAME',
            width: '15rem',
        },
        {
            field: 'email',
            header: 'SETTINGS_SECURITY.USER.TABLE.EMAIL',
            width: '15rem',
        },
        {
            field: 'status',
            header: 'SETTINGS_SECURITY.USER.TABLE.STATUT',
            class: 'text-center',
            width: '9rem',
        },
        {
            field: '__action',
            header: 'SETTINGS_SECURITY.USER.TABLE.ACTION',
            class: 'text-center',
            width: '9rem',
        },
    ],
    globalFilterFields: ['matricule', 'fullName', 'email', 'status'],
};

