export const SLA_ENDPOINTS = {
    LIST: 'agreement/sla',
    CREATE: 'agreement/sla/store',
    UPDATE: 'agreement/sla',
    ENABLE: 'agreement/sla',
    DISABLE: 'agreement/sla',
    DELETE: 'agreement/sla',
    REPORT_TYPES: 'agreement/sla-rule',
    REPORT_SLA: 'agreement/report-sla',
    BUSINESS_CONTACTS: 'agreement/business-contacts',
    SYSTEM_ALERT_CONTACTS: 'agreement/system-alert-contacts',
    REMOVE_BUSINESS: 'agreement/system-alert-contacts/remove-business',
} as const;
