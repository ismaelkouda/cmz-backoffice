export const ACCESS_LOGS_TABLE = {
    cols: [
        {
            field: 'createdAt',
            header: 'SETTINGS_SECURITY.ACCESS_LOGS.TABLE.DATE',
            class: 'text-center',
            width: '12rem',
        },
        {
            field: 'username',
            header: 'SETTINGS_SECURITY.ACCESS_LOGS.TABLE.USER',
            width: '15rem',
        },
        {
            field: 'ip',
            header: 'SETTINGS_SECURITY.ACCESS_LOGS.TABLE.IP_ADDRESS',
            class: 'text-center',
            width: '10rem',
        },
        {
            field: 'event',
            header: 'SETTINGS_SECURITY.ACCESS_LOGS.TABLE.EVENT',
            width: '15rem',
        },
        {
            field: 'action',
            header: 'SETTINGS_SECURITY.ACCESS_LOGS.TABLE.ACTION',
            width: '15rem',
        },
        {
            field: 'data',
            header: 'SETTINGS_SECURITY.ACCESS_LOGS.TABLE.DETAILS',
            width: '20rem',
        },
    ],
    globalFilterFields: ['username', 'ip', 'event', 'action', 'data'],
};
