export function calculateActionColumnWidth(actionCount: number): string {
    const width = Math.max(3, 0.5 + actionCount * 2.3);
    return `${width}rem`;
}

export const DOWNLOAD_DIALOG_TABLE = {
    cols: [
        {
            field: 'name',
            header: 'REPORT_STATES.DOWNLOAD.DIALOG.TABLE.NAME',
            class: 'text-center',
            width: '11rem',
        },
        {
            field: 'value',
            header: 'REPORT_STATES.DOWNLOAD.DIALOG.TABLE.VALUE',
            class: 'text-center',
            width: '11rem',
        },
    ],
    globalFilterFields: ['name', 'value'],
};

export const DOWNLOAD_TABLE = {
    actions: [
        {
            id: 'download',
            icon: 'pi pi-download',
            tooltip: 'REPORT_STATES.DOWNLOAD.TABLE.SEE_MORE',
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
            field: 'date',
            header: 'REPORT_STATES.DOWNLOAD.TABLE.DATE',
            class: 'text-center',
            width: '5rem',
        },
        {
            field: 'name',
            header: 'REPORT_STATES.DOWNLOAD.TABLE.NAME',
            class: 'text-center',
            width: '11rem',
        },
        {
            field: 'type',
            header: 'REPORT_STATES.DOWNLOAD.TABLE.TYPE',
            class: 'text-center',
            width: '5rem',
        },
        {
            field: 'size',
            header: 'REPORT_STATES.DOWNLOAD.TABLE.SIZE',
            class: 'text-center',
            width: '7rem',
        },
        {
            field: 'statusLabel',
            header: 'REPORT_STATES.DOWNLOAD.TABLE.STATUS',
            class: 'text-center',
            width: '6rem',
        },
        {
            field: 'filter',
            header: 'REPORT_STATES.DOWNLOAD.TABLE.FILTER',
            width: '5rem',
            type: 'badge-button',
        },
        {
            field: '__action',
            header: 'REPORT_STATES.DOWNLOAD.TABLE.ACTION',
            class: 'text-center',
            width: calculateActionColumnWidth(1),
        },
    ],
    globalFilterFields: [
        'date',
        'name',
        'type',
        'size',
        'statusLabel',
        'filter',
    ],
};
