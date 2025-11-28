import { TableConfig } from '@shared/services/table-export-excel-file.service';

export const NOTIFICATIONS_TABLE_CONSTANTS: TableConfig = {
    cols: [
        {
            field: '__index',
            header: 'TABLE.COMMON.INDEX',
            class: 'text-center',
            width: '3rem',
        },
        { field: 'createdAt', header: 'COMMUNICATION.NOTIFICATIONS.TABLE.CREATED_AT',
            class: 'text-center',
            width: '11rem', },
        { field: 'message', header: 'COMMUNICATION.NOTIFICATIONS.TABLE.MESSAGE' },
        { field: 'type', header: 'COMMUNICATION.NOTIFICATIONS.TABLE.TYPE',
            width: '13rem', },
    ],
    globalFilterFields: ['createdAt', 'message', 'type'],
};
