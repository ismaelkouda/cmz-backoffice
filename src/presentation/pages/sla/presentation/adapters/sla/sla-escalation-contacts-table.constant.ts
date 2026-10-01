export const SLA_ESCALATION_CONTACTS_TABLE = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'lastName',
            header: 'SLA.ESCALATION_CONTACTS.TABLE.LAST_NAME',
            width: '9rem',
        },
        {
            field: 'firstName',
            header: 'SLA.ESCALATION_CONTACTS.TABLE.FIRST_NAME',
            width: '10rem',
        },
        {
            field: 'phone',
            header: 'SLA.ESCALATION_CONTACTS.TABLE.PHONE',
            width: '10rem',
        },
        {
            field: 'email',
            header: 'SLA.ESCALATION_CONTACTS.TABLE.EMAIL',
            width: '16rem',
        },
        {
            field: 'categories',
            header: 'SLA.ESCALATION_CONTACTS.TABLE.CATEGORIES',
            width: '12rem',
        },
        {
            field: 'statusLabel',
            header: 'SLA.ESCALATION_CONTACTS.TABLE.STATUS',
            class: 'text-center',
            width: '7rem',
        },
        {
            field: 'updatedAt',
            header: 'SLA.ESCALATION_CONTACTS.TABLE.UPDATED_AT',
            class: 'text-center',
            width: '10rem',
        },
        {
            field: '__actionDropdown',
            header: 'SLA.ESCALATION_CONTACTS.TABLE.ACTION',
            class: 'text-center',
            width: '5rem',
        },
    ],
    globalFilterFields: [
        'lastName',
        'firstName',
        'phone',
        'email',
        'categoriesLabel',
        'statusLabel',
        'updatedAt',
    ],
};
