export const PROFILES_PERMISSIONS_TABLE_CONSTANT = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'name',
            header: 'SETTINGS_SECURITY.PROFILES_PERMISSIONS.TABLE.NAME',
            width: '10rem',
        },
        {
            field: 'description',
            header: 'SETTINGS_SECURITY.PROFILES_PERMISSIONS.TABLE.DESCRIPTION',
            width: '15rem',
        },
        {
            field: 'totalUsers',
            header: 'SETTINGS_SECURITY.PROFILES_PERMISSIONS.TABLE.USERS_COUNT',
            class: 'text-center',
            width: '7rem',
            type: 'badge-button',
        },
        {
            field: 'status',
            header: 'SETTINGS_SECURITY.PROFILES_PERMISSIONS.TABLE.STATUS',
            class: 'text-center',
            width: '5rem',
        },
        {
            field: 'createdAt',
            header: 'SETTINGS_SECURITY.PROFILES_PERMISSIONS.TABLE.CREATED_AT',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: '__actionDropdown',
            header: 'SETTINGS_SECURITY.PROFILES_PERMISSIONS.TABLE.ACTION',
            class: 'text-center',
            width: '4rem',
        },
    ],
    globalFilterFields: [
        'name',
        'description',
        'totalUsers',
        'status',
        'createdAt',
    ],
};
