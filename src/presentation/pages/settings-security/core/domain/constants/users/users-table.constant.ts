export const USERS_TABLE_CONSTANT = {
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
            width: '10rem',
        },
        {
            field: 'firstName',
            header: 'SETTINGS_SECURITY.USERS.TABLE.FIRST_NAME',
            width: '15rem',
        },
        {
            field: 'email',
            header: 'SETTINGS_SECURITY.USERS.TABLE.EMAIL',
            width: '10rem',
        },
        {
            field: 'phone',
            header: 'SETTINGS_SECURITY.USERS.TABLE.PHONE',
            width: '8rem',
        },
        {
            field: 'profile',
            header: 'SETTINGS_SECURITY.USERS.TABLE.PROFILE',
            width: '12rem',
        },
        {
            field: 'responsibility',
            header: 'SETTINGS_SECURITY.USERS.TABLE.RESPONSIBILITY',
            width: '12rem',
        },
        {
            field: 'status',
            header: 'SETTINGS_SECURITY.USERS.TABLE.STATUS',
            class: 'text-center',
            width: '5rem',
        },
        {
            field: 'createdAt',
            header: 'SETTINGS_SECURITY.USERS.TABLE.CREATED_AT',
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
        'responsibility',
        'status',
        'createdAt',
    ],
};
