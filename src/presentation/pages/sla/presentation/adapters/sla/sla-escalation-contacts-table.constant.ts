export const SLA_ESCALATION_CONTACTS_TABLE = {
    actions: [
        {
            id: 'view',
            icon: 'pi pi-eye',
            tooltip: 'SLA.ESCALATION_CONTACTS.TOOLTIP.VIEW',
            severity: 'contrast',
        },
        {
            id: 'edit',
            icon: 'pi pi-pencil',
            tooltip: 'SLA.ESCALATION_CONTACTS.TOOLTIP.EDIT',
            severity: 'primary',
        },
    ],
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'type',
            header: 'SLA.ESCALATION_CONTACTS.TABLE.TYPE',
            width: '12rem',
        },
        {
            field: 'fullName',
            header: 'SLA.ESCALATION_CONTACTS.TABLE.NAME',
            width: '14rem',
        },
        {
            field: 'jobTitle',
            header: 'SLA.ESCALATION_CONTACTS.TABLE.JOB_TITLE',
            width: '14rem',
        },
        {
            field: 'email',
            header: 'SLA.ESCALATION_CONTACTS.TABLE.EMAIL',
            width: '16rem',
        },
        {
            field: 'phone',
            header: 'SLA.ESCALATION_CONTACTS.TABLE.PHONE',
            width: '11rem',
        },
        {
            field: 'whatsapp',
            header: 'SLA.ESCALATION_CONTACTS.TABLE.WHATSAPP',
            width: '12rem',
        },
        {
            field: 'telegram',
            header: 'SLA.ESCALATION_CONTACTS.TABLE.TELEGRAM',
            width: '12rem',
        },
        // {
        //     field: 'updatedAt',
        //     header: 'SLA.ESCALATION_CONTACTS.TABLE.UPDATED_AT',
        //     class: 'text-center',
        //     width: '10rem',
        // },
        {
            field: '__action',
            header: 'SLA.ESCALATION_CONTACTS.TABLE.ACTION',
            class: 'text-center',
            width: '6rem',
        },
    ],
    globalFilterFields: [
        'type',
        'fullName',
        'jobTitle',
        'email',
        'phone',
        'whatsapp',
        'telegram',
    ],
};
