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
            editor: {
                type: 'select' as const,
                modelField: 'slaType',
                optionsField: 'serviceOptions',
                optionLabel: 'label',
                optionValue: 'value',
            },
        },
        {
            field: 'slaName',
            header: 'SLA_THRESHOLDS_FILTER.INDICATOR',
            editor: {
                type: 'select' as const,
                modelField: 'slaId',
                optionsField: 'indicatorOptions',
                optionLabel: 'name',
                optionValue: 'id',
            },
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
            editor: {
                type: 'select' as const,
                modelField: 'channel',
                optionsField: 'channelOptions',
                optionLabel: 'label',
                optionValue: 'value',
            },
        },
        {
            field: 'slaCategory',
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
    ],
};
