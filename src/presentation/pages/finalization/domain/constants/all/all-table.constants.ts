export function calculateActionColumnWidth(actionCount: number): string {
    const width = Math.max(3, 0.5 + actionCount * 2.3);
    return `${width}rem`;
}

export const ALL_TABLE = {
    actions: [
        {
            id: 'view',
            icon: 'pi pi-window-maximize',
            tooltip: 'FINALIZATION.ALL.TABLE.SEE_MORE',
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
            field: 'uniqId',
            header: 'FINALIZATION.ALL.TABLE.UNIQ_ID',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'reportTypeLabel',
            header: 'FINALIZATION.ALL.TABLE.REPORT_TYPE',
            width: '12rem',
        },
        {
            field: 'operators',
            header: 'FINALIZATION.ALL.TABLE.OPERATORS',
            width: '12rem',
        },
        {
            field: 'sourceLabel',
            header: 'FINALIZATION.ALL.TABLE.SOURCE',
            width: '12rem',
        },
        {
            field: 'reportedAt',
            header: 'FINALIZATION.ALL.TABLE.REPORTED_AT',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: '__action',
            header: 'FINALIZATION.ALL.TABLE.ACTION',
            class: 'text-center',
            width: calculateActionColumnWidth(1),
        },
    ],
    globalFilterFields: [
        'uniqId',
        'reportTypeLabel',
        'operators',
        'sourceLabel',
        'initiatorPhoneNumber',
        'reportedAt',
    ],
};
