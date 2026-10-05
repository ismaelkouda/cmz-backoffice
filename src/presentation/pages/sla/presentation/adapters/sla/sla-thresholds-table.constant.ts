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
            width: '8rem',
        },
        {
            field: 'slaName',
            header: 'SLA_THRESHOLDS_FILTER.INDICATOR',
            width: '8rem',
        },
        {
            field: 'description',
            header: 'SLA_THRESHOLDS_FILTER.DESCRIPTION',
        },
        {
            field: 'thresholdLabel',
            header: 'SLA_THRESHOLDS_FILTER.THRESHOLD',
            editor: {
                type: 'threshold' as const,
                modelField: 'threshold',
                displayField: 'thresholdLabel',
            },
            width: '8rem',
        },
        {
            field: 'channelLabel',
            header: 'SLA_THRESHOLDS_FILTER.CHANNEL',
            width: '15rem',
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
        'description',
        'thresholdLabel',
        'channelLabel',
        'slaCategoryLabel',
    ],
};
