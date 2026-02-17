export function calculateActionColumnWidth(actionCount: number): string {
    const width = Math.max(3, 0.5 + actionCount * 2.3);
    return `${width}rem`;
}

export const TASKS_TABLE_CONST = {
    actions: [
        {
            id: 'take',
            icon: 'pi pi-window-maximize',
            tooltip: 'PROCESSING.QUEUES.TABLE.TAKE',
            severity: 'primary',
        },
        {
            id: 'actions',
            icon: 'pi pi-check-circle',
            tooltip: 'PROCESSING.QUEUES.TABLE.TREAT',
            severity: 'info',
        },
    ],
    cols: [
        {
            field: '__selection',
            header: 'COMMON.SELECTION',
            class: 'text-center',
            width: '2rem',
            type: 'selection',
        },
        {
            field: 'uniqId',
            header: 'PROCESSING.TASKS.TABLE.UNIQ_ID',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'reportType',
            header: 'PROCESSING.TASKS.TABLE.REPORT_TYPE',
            width: '11rem',
        },
        {
            field: 'operators',
            header: 'PROCESSING.TASKS.TABLE.OPERATORS',
            width: '10rem',
        },
        {
            field: 'source',
            header: 'PROCESSING.TASKS.TABLE.SOURCE',
            width: '12rem',
        },
        {
            field: 'reportedAt',
            header: 'PROCESSING.TASKS.TABLE.REPORTED_AT',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: '__action',
            header: 'PROCESSING.TASKS.TABLE.ACTION',
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
