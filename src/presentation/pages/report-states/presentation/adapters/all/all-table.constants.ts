export function calculateActionColumnWidth(actionCount: number): string {
    const width = Math.max(3, 0.5 + actionCount * 2.3);
    return `${width}rem`;
}

export const ALL_TABLE = {
    actions: [
        {
            id: 'tasks-list',
            icon: 'pi pi-eye',
            tooltip: 'REPORT_STATES.ALL.TABLE.TASKS_LIST',
            severity: 'contrast',
        },
        {
            id: 'qualify',
            icon: 'pi pi-window-maximize',
            tooltip: 'REPORT_STATES.ALL.TABLE.QUALIFY',
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
            field: 'requestReportUniqId',
            header: 'REPORT_STATES.ALL.TABLE.REQUEST_REPORT_UNIQ_ID',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'uniqId',
            header: 'REPORT_STATES.ALL.TABLE.UNIQ_ID',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'reportTypeLabel',
            header: 'REPORT_STATES.ALL.TABLE.REPORT_TYPE',
            width: '11rem',
        },
        {
            field: 'operators',
            header: 'REPORT_STATES.ALL.TABLE.OPERATORS',
            width: '10rem',
        },
        {
            field: 'sourceLabel',
            header: 'REPORT_STATES.ALL.TABLE.SOURCE',
            width: '12rem',
        },
        {
            field: 'reportedAt',
            header: 'REPORT_STATES.ALL.TABLE.CREATED_AT',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'conformLabel',
            header: 'REPORT_STATES.ALL.TABLE.CONFORMITY',
            width: '6rem',
            class: 'text-center',
        },
        {
            field: 'requestReportsCount',
            header: 'REPORT_STATES.ALL.TABLE.REQUESTS_COUNT',
            class: 'text-center',
            width: '6rem',
            type: 'badge-button',
        },
        {
            field: '__action',
            header: 'REPORT_STATES.ALL.TABLE.ACTION',
            class: 'text-center',
            width: calculateActionColumnWidth(2),
        },
    ],
    globalFilterFields: [
        'uniqId',
        'requestReportUniqId',
        'reportTypeLabel',
        'operators',
        'sourceLabel',
        'initiatorPhoneNumber',
        'reportedAt',
        'conformLabel',
    ],
};
