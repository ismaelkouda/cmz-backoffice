export const SLA_BUSINESS_CONTACTS_TABLE = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'lastName',
            header: 'SLA.BUSINESS_CONTACTS.TABLE.LAST_NAME',
            width: '10rem',
        },
        {
            field: 'firstName',
            header: 'SLA.BUSINESS_CONTACTS.TABLE.FIRST_NAME',
            width: '10rem',
        },
        {
            field: 'phone',
            header: 'SLA.BUSINESS_CONTACTS.TABLE.PHONE',
            width: '10rem',
        },
        {
            field: 'email',
            header: 'SLA.BUSINESS_CONTACTS.TABLE.EMAIL',
            width: '16rem',
        },
        {
            field: 'indicatorsCount',
            header: 'SLA.BUSINESS_CONTACTS.TABLE.INDICATORS_COUNT',
            class: 'text-center',
            width: '8rem',
            type: 'badge-button',
        },
        {
            field: 'statusLabel',
            header: 'SLA.BUSINESS_CONTACTS.TABLE.STATUS',
            class: 'text-center',
            width: '7rem',
        },
        {
            field: 'createdAt',
            header: 'SLA.BUSINESS_CONTACTS.TABLE.CREATED_AT',
            class: 'text-center',
            width: '10rem',
        },
        {
            field: '__actionDropdown',
            header: 'SLA.BUSINESS_CONTACTS.TABLE.ACTION',
            class: 'text-center',
            width: '5rem',
        },
    ],
    globalFilterFields: [
        'lastName',
        'firstName',
        'phone',
        'email',
        'indicatorsCount',
        'statusLabel',
        'createdAt',
    ],
};
