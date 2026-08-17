export function calculateActionColumnWidth(actionCount: number): string {
    const width = Math.max(3, 0.5 + actionCount * 2.3);
    return `${width}rem`;
}

export const MESSAGING_TABLE = {
    actions: [
        {
            id: 'view',
            icon: 'pi pi-window-maximize',
            tooltip: 'COMMUNICATION.MESSAGING.TABLE.SEE_MORE',
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
            field: 'type',
            header: 'COMMUNICATION.MESSAGING.TABLE.TYPE',
            width: '7rem',
        },
        {
            field: 'targetType',
            header: 'COMMUNICATION.MESSAGING.TABLE.TARGET_TYPE',
            width: '7rem',
        },
        {
            field: 'channels',
            header: 'COMMUNICATION.MESSAGING.TABLE.CHANNELS',
            width: '7rem',
        },
        {
            field: 'subject',
            header: 'COMMUNICATION.MESSAGING.TABLE.SUBJECT',
            width: '10rem',
        },
        // {
        //     field: 'content',
        //     header: 'COMMUNICATION.MESSAGING.TABLE.CONTENT',
        //     width: '13rem',
        // },
        {
            field: 'createdAt',
            header: 'COMMUNICATION.MESSAGING.TABLE.CREATED_AT',
            class: 'text-center',
            width: '7rem',
        },
        {
            field: '__action',
            header: 'COMMUNICATION.MESSAGING.TABLE.ACTION',
            class: 'text-center',
            width: calculateActionColumnWidth(1),
        },
    ],
    globalFilterFields: [
        'type',
        'targetType',
        'message',
        'channels',
        'subject',
        'createdAt',
    ],
};
