import { TableConfig } from '@shared/domain/services/table-export-excel-file.service';

export const HISTORY_DIALOG_TABLE_CONFIG: TableConfig = {
    cols: [
        {
            field: 'fieldLabel',
            header: 'HISTORY.DIALOG.FIELD',
            width: '25%',
        },
        {
            field: 'beforeDisplay',
            header: 'HISTORY.DIALOG.BEFORE',
            width: '30%',
            class: 'before-value-column',
        },
        {
            field: 'afterDisplay',
            header: 'HISTORY.DIALOG.AFTER',
            width: '30%',
            class: 'after-value-column',
        },
        {
            field: 'changed',
            header: 'HISTORY.DIALOG.CHANGE',
            width: '15%',
            class: 'change-status-column text-center',
            type: 'badge',
        },
    ],
    globalFilterFields: ['fieldLabel', 'beforeDisplay', 'afterDisplay'],
};
