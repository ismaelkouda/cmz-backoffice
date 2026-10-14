export const SLA_BUSINESS_CONTACT_MANAGEMENT_TABLE = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'slaTypeLabel',
            header: 'SLA.BUSINESS_CONTACTS.MANAGEMENT.TABLE.SERVICE',
            width: '10rem',
        },
        {
            field: 'slaName',
            header: 'SLA.BUSINESS_CONTACTS.MANAGEMENT.TABLE.INDICATOR',
            width: '15rem',
        },
        {
            field: 'description',
            header: 'SLA.BUSINESS_CONTACTS.MANAGEMENT.TABLE.DESCRIPTION',
            width: '20rem',
        },
        {
            field: 'categoryLabel',
            header: 'SLA.BUSINESS_CONTACTS.MANAGEMENT.TABLE.CATEGORY',
            width: '10rem',
        },
        {
            field: 'updatedAt',
            header: 'SLA.CHANNELS.TABLE.UPDATED_AT',
            width: '10rem',
        },
        {
            field: '__selection',
            header: 'COMMON.SELECTION',
            class: 'text-center',
            width: '4rem',
            type: 'selection',
        },
    ],
    globalFilterFields: [
        'slaTypeLabel',
        'slaName',
        'description',
        'categoryLabel',
        'updatedAt',
    ],
};
