export const USERS_TABLE = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'lastName',
            header: 'SETTINGS_SECURITY.USERS.TABLE.LAST_NAME',
            width: '7rem',
        },
        {
            field: 'firstName',
            header: 'SETTINGS_SECURITY.USERS.TABLE.FIRST_NAME',
            width: '10rem',
        },
        {
            field: 'email',
            header: 'SETTINGS_SECURITY.USERS.TABLE.EMAIL',
            width: '15rem',
        },
        {
            field: 'phone',
            header: 'SETTINGS_SECURITY.USERS.TABLE.PHONE',
            width: '5rem',
        },
        {
            field: 'profile',
            header: 'SETTINGS_SECURITY.USERS.TABLE.PROFILE',
            width: '8em',
        },
        {
            field: 'roleLabel',
            header: 'SETTINGS_SECURITY.USERS.TABLE.ROLE',
            class: 'text-center',
            width: '7rem',
        },
        {
            field: 'statusLabel',
            header: 'SETTINGS_SECURITY.USERS.TABLE.STATUS',
            class: 'text-center',
            width: '5rem',
        },
        {
            field: 'updatedAt',
            header: 'SETTINGS_SECURITY.USERS.TABLE.UPDATED_AT',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: '__actionDropdown',
            header: 'SETTINGS_SECURITY.USERS.TABLE.ACTION',
            class: 'text-center',
            width: '4rem',
        },
    ],
    globalFilterFields: [
        'lastName',
        'firstName',
        'email',
        'phone',
        'profile',
        'roleLabel',
        'statusLabel',
        'updatedAt',
    ],
};
