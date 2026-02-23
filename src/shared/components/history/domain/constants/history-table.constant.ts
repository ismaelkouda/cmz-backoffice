export const HISTORY_TABLE_CONSTANT = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            width: '2rem',
            class: 'text-center',
        },
        {
            field: 'actionType',
            header: 'HISTORY.TABLE.ACTION_TYPE',
            width: '10rem',
        },
        {
            field: 'action',
            header: 'HISTORY.TABLE.ACTION',
            width: '20rem',
        },
        {
            field: 'source',
            header: 'HISTORY.TABLE.SOURCE',
            width: '10rem',
        },
        {
            field: 'createdAt',
            header: 'HISTORY.TABLE.CREATED_AT',
            width: '10rem',
            type: 'date',
            class: 'text-center',
        },
        {
            field: '__action_details',
            header: 'COMMON.DETAILS',
            width: '5rem',
            type: 'button',
            icon: 'pi pi-eye',
            class: 'text-center',
        },
    ],
    globalFilterFields: ['actionType', 'action', 'source', 'createdAt'],
};
