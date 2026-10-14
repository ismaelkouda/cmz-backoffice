export const SLA_ALERT_CHANNEL_TABS = [
    {
        value: '0',
        route: '/sla/channel-alert',
        label: 'SLA.ALERT_CHANNEL.TABS.LIST',
        icon: 'pi pi-list',
    },
    {
        value: '1',
        route: '/sla/channel-alert/history',
        label: 'SLA.ALERT_CHANNEL.TABS.HISTORY',
        icon: 'pi pi-history',
        queryParams: { ref: 'escalation-contact-channels' },
    },
] as const;
