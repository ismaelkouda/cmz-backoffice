export function calculateActionColumnWidth(actionCount: number): string {
    const width = Math.max(3, 0.5 + actionCount * 2.3);
    return `${width}rem`;
}

export const TASKS_TABLE_CONST = {
    actions: [
        {
            id: 'management-dialog',
            icon: 'pi pi-window-maximize',
            tooltip: 'FINALIZATION.QUEUES.TABLE.TAKE',
            severity: 'primary',
        },
        /* {
            id: 'finalize',
            icon: 'pi pi-check-circle',
            tooltip: 'FINALIZATION.QUEUES.TABLE.FINALIZE',
            severity: 'info',
        }, */
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
            header: 'FINALIZATION.TASKS.TABLE.UNIQ_ID',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'reportType',
            header: 'FINALIZATION.TASKS.TABLE.REPORT_TYPE',
            width: '11rem',
        },
        {
            field: 'operators',
            header: 'FINALIZATION.TASKS.TABLE.OPERATORS',
            width: '10rem',
        },
        {
            field: 'source',
            header: 'FINALIZATION.TASKS.TABLE.SOURCE',
            width: '12rem',
        },
        {
            field: 'reportedAt',
            header: 'FINALIZATION.TASKS.TABLE.REPORTED_AT',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: '__action',
            header: 'FINALIZATION.TASKS.TABLE.ACTION',
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
