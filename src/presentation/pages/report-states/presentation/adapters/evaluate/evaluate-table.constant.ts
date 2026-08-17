export function calculateActionColumnWidth(actionCount: number): string {
    const width = Math.max(3, 0.5 + actionCount * 2.3);
    return `${width}rem`;
}

export const EVALUATE_TABLE = {
    actions: [
        {
            id: 'tasks-list',
            icon: 'pi pi-eye',
            tooltip: 'REPORT_STATES.EVALUATE.TABLE.TASKS_LIST',
            severity: 'contrast',
        },
        {
            id: 'take',
            icon: 'pi pi-window-maximize',
            tooltip: 'REPORT_STATES.EVALUATE.TABLE.TAKE',
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
            header: 'REPORT_STATES.EVALUATE.TABLE.UNIQ_ID',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'reportTypeLabel',
            header: 'REPORT_STATES.EVALUATE.TABLE.REPORT_TYPE',
            width: '11rem',
        },
        {
            field: 'operators',
            header: 'REPORT_STATES.EVALUATE.TABLE.OPERATORS',
            width: '10rem',
        },
        {
            field: 'sourceLabel',
            header: 'REPORT_STATES.EVALUATE.TABLE.SOURCE',
            width: '12rem',
        },
        {
            field: 'reportedAt',
            header: 'REPORT_STATES.EVALUATE.TABLE.CREATED_AT',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: '__action',
            header: 'REPORT_STATES.EVALUATE.TABLE.ACTION',
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
