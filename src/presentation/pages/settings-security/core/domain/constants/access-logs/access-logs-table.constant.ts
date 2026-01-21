export const ACCESS_LOGS_TABLE_CONSTANT = {
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
            width: '10rem',
        },
        {
            field: 'source',
            header: 'SETTINGS_SECURITY.ACCESS_LOGS.TABLE.SOURCE',
            width: '10rem',
        },
        {
            field: 'usedAgent',
            header: 'SETTINGS_SECURITY.ACCESS_LOGS.TABLE.USED_AGENT',
            width: '20rem',
        },
        {
            field: 'createdAt',
            header: 'SETTINGS_SECURITY.ACCESS_LOGS.TABLE.CREATED_AT',
            class: 'text-center',
            width: '8rem',
        }
    ],
    globalFilterFields: [
        'id',
        'action',
        'source',
        'usedAgent',
        'createdAt',
    ],
};