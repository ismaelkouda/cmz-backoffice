export const INFRASTRUCTURE_TYPE_TABLE = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'name',
            header: 'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE_TYPE.TABLE.NAME',
            width: '15rem',
        },
        {
            field: 'tag',
            header: 'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE_TYPE.TABLE.TAG',
            width: '5rem',
        },
        {
            field: 'description',
            header: 'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE_TYPE.TABLE.DESCRIPTION',
            width: '18rem',
        },
        {
            field: 'statusLabel',
            header: 'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE_TYPE.TABLE.STATUS',
            class: 'text-center',
            width: '3rem',
        },
        {
            field: 'updatedAt',
            header: 'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE_TYPE.TABLE.UPDATED_AT',
            class: 'text-center',
            width: '6rem',
        },
        {
            field: '__actionDropdown',
            header: 'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE_TYPE.TABLE.ACTION',
            class: 'text-center',
            width: '4rem',
        },
    ],
    globalFilterFields: ['name', 'description', 'statusLabel', 'updatedAt'],
};
