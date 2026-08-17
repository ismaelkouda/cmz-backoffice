export function calculateActionColumnWidth(actionCount: number): string {
    const width = Math.max(3, 0.5 + actionCount * 2.3);
    return `${width}rem`;
}

export const QUEUES_TABLE = {
    actions: [
        {
            id: 'take',
            icon: 'pi pi-window-maximize',
            tooltip: 'FINALIZATION.QUEUES.TABLE.TAKE',
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
            header: 'FINALIZATION.QUEUES.TABLE.UNIQ_ID',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'reportTypeLabel',
            header: 'FINALIZATION.QUEUES.TABLE.REPORT_TYPE',
            width: '11rem',
        },
        {
            field: 'operators',
            header: 'FINALIZATION.QUEUES.TABLE.OPERATORS',
            width: '10rem',
        },
        {
            field: 'sourceLabel',
            header: 'FINALIZATION.QUEUES.TABLE.SOURCE',
            width: '12rem',
        },
        {
            field: 'reportedAt',
            header: 'FINALIZATION.QUEUES.TABLE.REPORTED_AT',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: '__action',
            header: 'FINALIZATION.QUEUES.TABLE.ACTION',
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
