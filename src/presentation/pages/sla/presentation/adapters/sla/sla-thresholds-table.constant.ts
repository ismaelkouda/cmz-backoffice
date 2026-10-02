export const SLA_THRESHOLDS_TABLE = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'slaTypeLabel',
            header: 'SLA_THRESHOLDS_FILTER.SERVICE',
        },
        {
            field: 'slaName',
            header: 'SLA_THRESHOLDS_FILTER.INDICATOR',
        },
        {
            field: 'thresholdLabel',
            header: 'SLA_THRESHOLDS_FILTER.THRESHOLD',
            editor: {
                type: 'threshold' as const,
                modelField: 'threshold',
                displayField: 'thresholdLabel',
            },
        },
        {
            field: 'channelLabel',
            header: 'SLA_THRESHOLDS_FILTER.CHANNEL',
        },
        {
            field: 'slaCategoryLabel',
            header: 'SLA.SLA_LIST.FILTER.CATEGORY',
            width: '8rem',
        },
        {
            field: '__action',
            header: 'SLA_THRESHOLDS_FILTER.ACTION',
            class: 'text-center',
            width: '7rem',
        },
    ],
    globalFilterFields: [
        'slaTypeLabel',
        'slaName',
        'thresholdLabel',
        'channelLabel',
        'slaCategoryLabel',
    ],
};
