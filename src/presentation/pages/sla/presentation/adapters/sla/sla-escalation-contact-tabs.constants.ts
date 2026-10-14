import {
    SLA_ESCALATION_CONTACT_HISTORY_ROUTE,
    SLA_ESCALATION_CONTACT_LIST_ROUTE,
} from '@pages/sla/presentation/features/sla-escalation-contacts/sla-escalation-contacts-paths.constants';

export const SLA_ESCALATION_CONTACT_TABS = [
    {
        value: '0',
        route: `/sla/escalation-contact/${SLA_ESCALATION_CONTACT_LIST_ROUTE}`,
        label: 'SLA.ESCALATION_CONTACTS.TABS.CONTACTS',
        icon: 'pi pi-users',
    },
    {
        value: '1',
        route: `/sla/escalation-contact/${SLA_ESCALATION_CONTACT_HISTORY_ROUTE}`,
        label: 'SLA.ESCALATION_CONTACTS.TABS.HISTORY',
        icon: 'pi pi-history',
        queryParams: { ref: 'escalation-contacts' },
    },
] as const;
