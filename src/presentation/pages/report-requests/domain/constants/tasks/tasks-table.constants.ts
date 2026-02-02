export function calculateActionColumnWidth(actionCount: number): string {
    const width = Math.max(3, 0.5 + actionCount * 2.3);
    return `${width}rem`;
}

export const TASKS_TABLE_CONST = {
    actions: [
        {
            id: 'qualify',
            icon: 'pi pi-window-maximize',
            tooltip: 'REPORTS_REQUESTS.TASKS.TABLE.QUALIFY',
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
            header: 'REPORTS_REQUESTS.TASKS.TABLE.UNIQ_ID',
            class: 'text-center',
            width: '7rem',
        },
        {
            field: 'reportType',
            header: 'REPORTS_REQUESTS.TASKS.TABLE.REPORT_TYPE',
            width: '8rem',
        },
        {
            field: 'operators',
            header: 'REPORTS_REQUESTS.TASKS.TABLE.OPERATORS',
            width: '7rem',
        },
        {
            field: 'source',
            header: 'REPORTS_REQUESTS.TASKS.TABLE.SOURCE',
            width: '7rem',
        },
        {
            field: 'reportedAt',
            header: 'REPORTS_REQUESTS.TASKS.TABLE.CREATED_AT',
            class: 'text-center',
            width: '6rem',
        },
        {
            field: '__action',
            header: 'REPORTS_REQUESTS.TASKS.TABLE.ACTION',
            class: 'text-center',
            width: '1rem',
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
