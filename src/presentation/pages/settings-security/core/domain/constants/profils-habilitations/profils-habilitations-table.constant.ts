export const PROFILES_HABILITATIONS_TABLE_CONSTANT = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'name',
            header: 'SETTINGS_SECURITY.PROFILES_HABILITATIONS.TABLE.NAME',
            width: '10rem',
        },
        {
            field: 'description',
            header: 'SETTINGS_SECURITY.PROFILES_HABILITATIONS.TABLE.DESCRIPTION',
            width: '15rem',
        },
        {
            field: 'usersCount',
            header: 'SETTINGS_SECURITY.PROFILES_HABILITATIONS.TABLE.USERS_COUNT',
            class: 'text-center',
            width: '7rem',
            type: 'badge-button',
        },
        {
            field: 'status',
            header: 'SETTINGS_SECURITY.PROFILES_HABILITATIONS.TABLE.STATUS',
            class: 'text-center',
            width: '5rem',
        },
        {
            field: 'createdAt',
            header: 'SETTINGS_SECURITY.PROFILES_HABILITATIONS.TABLE.CREATED_AT',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: '__actionDropdown',
            header: 'SETTINGS_SECURITY.PROFILES_HABILITATIONS.TABLE.ACTION',
            class: 'text-center',
            width: '4rem',
        },
    ],
    globalFilterFields: [
        'name',
        'description',
        'usersCount',
        'status',
        'createdAt',
    ],
};
