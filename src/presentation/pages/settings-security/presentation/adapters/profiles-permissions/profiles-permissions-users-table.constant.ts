export const PROFILES_PERMISSIONS_USERS = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'lastName',
            header: 'SETTINGS_SECURITY.PROFILES_PERMISSIONS.USERS.TABLE.LAST_NAME',
            width: '10rem',
        },
        {
            field: 'firstName',
            header: 'SETTINGS_SECURITY.PROFILES_PERMISSIONS.USERS.TABLE.FIRST_NAME',
            width: '15rem',
        },
        {
            field: 'phone',
            header: 'SETTINGS_SECURITY.PROFILES_PERMISSIONS.USERS.TABLE.PHONE',
            class: 'text-center',
            width: '10rem',
        },
        {
            field: 'email',
            header: 'SETTINGS_SECURITY.PROFILES_PERMISSIONS.USERS.TABLE.EMAIL',
            class: 'text-center',
            width: '15rem',
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
