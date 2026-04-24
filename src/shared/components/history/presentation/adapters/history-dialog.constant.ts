// history-dialog-table.config.ts
import { TableConfig } from '@shared/domain/services/table-export-excel-file.service';

/**
 * Configuration pour le mode DIFF (comparaison avant/après)
 * Utilisé pour les événements de type UPDATE
 */
export const HISTORY_DIFF_TABLE_CONFIG: TableConfig = {
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

/**
 * Configuration pour le mode SNAPSHOT (vue simple)
 * Utilisé pour les événements de type CREATE et DELETE
 */
export const HISTORY_SNAPSHOT_TABLE_CONFIG: TableConfig = {
    cols: [
        {
            field: 'fieldLabel',
            header: 'HISTORY.DIALOG.FIELD',
            width: '35%',
        },
        {
            field: 'afterDisplay',
            header: 'HISTORY.DIALOG.VALUE',
            width: '65%',
            class: 'after-value-column',
        },
    ],
    globalFilterFields: ['fieldLabel', 'afterDisplay'],
};
