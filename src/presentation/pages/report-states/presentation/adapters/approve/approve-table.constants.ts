export function calculateActionColumnWidth(actionCount: number): string {
    const width = Math.max(3, 0.5 + actionCount * 2.3);
    return `${width}rem`;
}

export const APPROVE_TABLE = {
    actions: [
        {
            id: 'qualify',
            icon: 'pi pi-window-maximize',
            tooltip: 'REPORT_STATES.APPROVE.TABLE.QUALIFY',
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
            header: 'REPORT_STATES.APPROVE.TABLE.UNIQ_ID',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'requestReportUniqId',
            header: 'REPORT_STATES.APPROVE.TABLE.REQUEST_REPORT_UNIQ_ID',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'reportTypeLabel',
            header: 'REPORT_STATES.APPROVE.TABLE.REPORT_TYPE',
            width: '11rem',
        },
        {
            field: 'operators',
            header: 'REPORT_STATES.APPROVE.TABLE.OPERATORS',
            width: '10rem',
        },
        {
            field: 'sourceLabel',
            header: 'REPORT_STATES.APPROVE.TABLE.SOURCE',
            width: '12rem',
        },
        // {
        //     field: 'evaluationsCount',
        //     header: 'REPORT_STATES.APPROVE.TABLE.EVALUATIONS_COUNT',
        //     class: 'text-center',
        //     width: '8rem',
        //     type: 'badge-button',
        // },
        {
            field: 'reportedAt',
            header: 'REPORT_STATES.APPROVE.TABLE.CREATED_AT',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: '__action',
            header: 'REPORT_STATES.APPROVE.TABLE.ACTION',
            class: 'text-center',
            width: calculateActionColumnWidth(1),
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
    ],
};
