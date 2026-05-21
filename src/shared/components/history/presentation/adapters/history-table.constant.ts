export function calculateActionColumnWidth(actionCount: number): string {
    const width = Math.max(3, 0.5 + actionCount * 2.3);
    return `${width}rem`;
}

export const HISTORY_TABLE = {
    actions: [
        {
            id: 'history-dialog',
            icon: 'pi pi-window-maximize',
            tooltip: 'HISTORY.TABLE.SEE_MORE',
            severity: 'primary',
        },
    ],
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            width: '2rem',
            class: 'text-center',
        },
        {
            field: 'actionType',
            header: 'HISTORY.TABLE.ACTION_TYPE',
            width: '5rem',
        },
        {
            field: 'action',
            header: 'HISTORY.TABLE.DETAILS',
            width: '15rem',
        },
        {
            field: 'source',
            header: 'HISTORY.TABLE.SOURCE',
            width: '10rem',
        },
        {
            field: 'createdAt',
            header: 'HISTORY.TABLE.CREATED_AT',
            width: '7rem',
            type: 'date',
            class: 'text-center',
        },
        {
            field: '__action',
            header: 'HISTORY.TABLE.ACTION',
            class: 'text-center',
            width: calculateActionColumnWidth(1),
        },
    ],
    globalFilterFields: ['actionType', 'action', 'source', 'createdAt'],
};
