export function calculateActionColumnWidth(actionCount: number): string {
    const width = Math.max(3, 0.5 + actionCount * 2.3);
    return `${width}rem`;
}

export const NOTIFICATIONS = {
    actions: [
        {
            id: 'management-dialog',
            icon: 'pi pi-window-maximize',
            tooltip: 'COMMUNICATION.NOTIFICATIONS.TABLE.READ',
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
        // {
        //     field: 'reference',
        //     header: 'COMMUNICATION.NOTIFICATIONS.TABLE.REFERENCE',
        //     width: '8rem',
        // },
        {
            field: 'title',
            header: 'COMMUNICATION.NOTIFICATIONS.TABLE.TITLE',
            width: '18rem',
        },
        {
            field: 'message',
            header: 'COMMUNICATION.NOTIFICATIONS.TABLE.MESSAGE',
            type: 'tooltip',
            width: '20rem',
        },
        {
            field: 'status',
            header: 'COMMUNICATION.NOTIFICATIONS.TABLE.STATUS',
            class: 'text-center',
            width: '5rem',
        },
        {
            field: 'sendAt',
            header: 'COMMUNICATION.NOTIFICATIONS.TABLE.SEND_AT',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: '__action',
            header: 'COMMUNICATION.NOTIFICATIONS.TABLE.ACTION',
            class: 'text-center',
            width: calculateActionColumnWidth(1),
        },
    ],
    globalFilterFields: ['title', 'message', 'status', 'sendAt'],
};
