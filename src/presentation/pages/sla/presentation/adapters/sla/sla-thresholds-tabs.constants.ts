export const SLA_THRESHOLDS_TABS = [
    {
        value: '0',
        route: '/sla/thresholds',
        label: 'SLA.THRESHOLDS.TABS.LIST',
        icon: 'pi pi-list',
    },
    {
        value: '1',
        route: '/sla/thresholds/history',
        label: 'SLA.THRESHOLDS.TABS.HISTORY',
        icon: 'pi pi-history',
        queryParams: { ref: 'sla-rules' },
    },
] as const;
