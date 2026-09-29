export const SLA_LIST_TABLE = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'name',
            header: 'SLA.SLA_LIST.TABLE.NAME',
            width: '7rem',
        },
        {
            field: 'description',
            header: 'SLA.SLA_LIST.TABLE.DESCRIPTION',
        },
        {
            field: 'categoryLabel',
            header: 'SLA.SLA_LIST.FILTER.CATEGORY',
            width: '8rem',
        },
        {
            field: 'statusLabel',
            header: 'SLA.SLA_LIST.TABLE.STATUS',
            class: 'text-center',
            width: '8rem',
        },
        // {
        //     field: 'createdAt',
        //     header: 'SLA.SLA_LIST.TABLE.CREATED_AT',
        //     class: 'text-center',
        //     width: '8rem',
        // },
        // {
        //     field: 'updatedAt',
        //     header: 'SLA.SLA_LIST.TABLE.UPDATED_AT',
        //     class: 'text-center',
        //     width: '8rem',
        // },
        // {
        //     field: '__actionDropdown',
        //     header: 'SLA.SLA_LIST.TABLE.ACTION',
        //     class: 'text-center',
        //     width: '8rem',
        // },
    ],
    globalFilterFields: ['name', 'description', 'createdAt', 'updatedAt'],
};
