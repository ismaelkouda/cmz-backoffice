export const ACCESS_LOGS_TABLE = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'action',
            header: 'SETTINGS_SECURITY.ACCESS_LOGS.TABLE.ACTION',
            width: '6rem',
        },
        {
            field: 'source',
            header: 'SETTINGS_SECURITY.ACCESS_LOGS.TABLE.SOURCE',
            width: '18rem',
        },
        {
            field: 'usedAgent',
            header: 'SETTINGS_SECURITY.ACCESS_LOGS.TABLE.USED_AGENT',
            type: 'tooltip',
            width: '18rem',
        },
        {
            field: 'createdAt',
            header: 'SETTINGS_SECURITY.ACCESS_LOGS.TABLE.CREATED_AT',
            class: 'text-center',
            width: '9rem',
        },
    ],
    globalFilterFields: ['action', 'source', 'usedAgent', 'createdAt'],
};
