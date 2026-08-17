export function calculateActionColumnWidth(actionCount: number): string {
    const width = Math.max(3, 0.5 + actionCount * 2.3);
    return `${width}rem`;
}

export const CLOSE_TABLE = {
    actions: [
        {
            id: 'tasks-list',
            icon: 'pi pi-eye',
            tooltip: 'REPORT_STATES.CLOSE.TABLE.TASKS_LIST',
            severity: 'contrast',
        },
        {
            id: 'qualify',
            icon: 'pi pi-window-maximize',
            tooltip: 'REPORT_STATES.CLOSE.TABLE.QUALIFY',
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
            header: 'REPORT_STATES.CLOSE.TABLE.UNIQ_ID',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'reportTypeLabel',
            header: 'REPORT_STATES.CLOSE.TABLE.REPORT_TYPE',
            width: '11rem',
        },
        {
            field: 'operators',
            header: 'REPORT_STATES.CLOSE.TABLE.OPERATORS',
            width: '10rem',
        },
        {
            field: 'sourceLabel',
            header: 'REPORT_STATES.CLOSE.TABLE.SOURCE',
            width: '12rem',
        },
        {
            field: 'reportedAt',
            header: 'REPORT_STATES.CLOSE.TABLE.CREATED_AT',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: '__action',
            header: 'REPORT_STATES.CLOSE.TABLE.ACTION',
            class: 'text-center',
            width: calculateActionColumnWidth(2),
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
