export function calculateActionColumnWidth(actionCount: number): string {
    const width = Math.max(3, 0.5 + actionCount * 2.3);
    return `${width}rem`;
}

export const QUEUES_TABLE_CONST = {
    actions: [
        {
            id: 'take',
            icon: 'pi pi-window-maximize',
            tooltip: 'REPORTS_REQUESTS.QUEUES.TABLE.TAKE',
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
            header: 'REPORTS_REQUESTS.QUEUES.TABLE.UNIQ_ID',
            class: 'text-center',
            width: '7rem',
        },
        {
            field: 'reportType',
            header: 'REPORTS_REQUESTS.QUEUES.TABLE.REPORT_TYPE',
            width: '8rem',
        },
        {
            field: 'operators',
            header: 'REPORTS_REQUESTS.QUEUES.TABLE.OPERATORS',
            width: '7rem',
        },
        {
            field: 'source',
            header: 'REPORTS_REQUESTS.QUEUES.TABLE.SOURCE',
            width: '7rem',
        },
        {
            field: 'reportedAt',
            header: 'REPORTS_REQUESTS.QUEUES.TABLE.CREATED_AT',
            class: 'text-center',
            width: '6rem',
        },
        {
            field: '__action',
            header: 'REPORTS_REQUESTS.QUEUES.TABLE.ACTION',
            class: 'text-center',
            width: calculateActionColumnWidth(1),
        },
    ],
    globalFilterFields: [
        'uniqId',
        'reportType',
        'operators',
        'source',
        'reportedAt',
    ],
};
