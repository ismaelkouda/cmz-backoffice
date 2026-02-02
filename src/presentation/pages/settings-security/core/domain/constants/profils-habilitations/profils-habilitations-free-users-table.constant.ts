export const PROFILES_HABILITATIONS_FREE_USERS_TABLE_CONSTANT = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'firstName',
            header: 'SETTINGS_SECURITY.PROFILES_HABILITATIONS.FREE_USERS.TABLE.FIRST_NAME',
            width: '10rem',
        },
        {
            field: 'lastName',
            header: 'SETTINGS_SECURITY.PROFILES_HABILITATIONS.FREE_USERS.TABLE.LAST_NAME',
            width: '20rem',
        },
        {
            field: 'phone',
            header: 'SETTINGS_SECURITY.PROFILES_HABILITATIONS.FREE_USERS.TABLE.PHONE',
            class: 'text-center',
            width: '2rem',
            type: 'badge-button',
        },
        {
            field: 'email',
            header: 'SETTINGS_SECURITY.PROFILES_HABILITATIONS.FREE_USERS.TABLE.EMAIL',
            class: 'text-center',
            width: '3rem',
        },
        {
            field: '__selection',
            header: 'COMMON.SELECTION',
            class: 'text-center',
            width: '2rem',
            type: 'selection',
        },
    ],
    globalFilterFields: ['firstName', 'lastName', 'phone', 'email'],
};
