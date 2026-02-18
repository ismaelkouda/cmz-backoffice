export function calculateActionColumnWidth(actionCount: number): string {
    const width = Math.max(3, 0.5 + actionCount * 2.3);
    return `${width}rem`;
}

export const QUEUES_TABLE_CONST = {
    actions: [
        {
            id: 'management-dialog',
            icon: 'pi pi-window-maximize',
            tooltip: 'REQUESTS.QUEUES.TABLE.SEE_MORE',
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
            header: 'PROCESSING.QUEUES.TABLE.UNIQ_ID',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'reportType',
            header: 'PROCESSING.QUEUES.TABLE.REPORT_TYPE',
            width: '11rem',
        },
        {
            field: 'operators',
            header: 'PROCESSING.QUEUES.TABLE.OPERATORS',
            width: '10rem',
        },
        {
            field: 'source',
            header: 'PROCESSING.QUEUES.TABLE.SOURCE',
            width: '12rem',
        },
        {
            field: 'reportedAt',
            header: 'PROCESSING.QUEUES.TABLE.REPORTED_AT',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: '__action',
            header: 'PROCESSING.QUEUES.TABLE.ACTION',
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
