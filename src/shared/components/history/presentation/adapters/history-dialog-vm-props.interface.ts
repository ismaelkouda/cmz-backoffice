export interface HistoryDialogChangeRowVM {
    fieldKey: string;
    fieldLabel: string;
    beforeDisplay: string;
    afterDisplay: string;
    changeLabelKey: string;
    changeStyle: 'success' | 'warning' | 'danger' | 'secondary';
    changed: string;
    changeType: HistoryChangeType;
    highlight: boolean;
}

// history-dialog-vm-props.interface.ts (AJOUT)
import { TableConfig } from '@shared/domain/services/table-export-excel-file.service';

import { HistoryChangeType } from '../../domain/enums/history-change-type.enum';
import { HistoryEventType } from '../../domain/enums/history-event-type.enum';

import { HistoryTableMode } from './history-table-mode.enum';

export interface HistoryDialogViewModel {
    header: {
        titleKey: string;
        uniqId: string;
        eventType: HistoryEventType;
        eventLabelKey: string;
        eventSeverity: 'success' | 'info' | 'warning' | 'danger' | 'contrast';
        timestamp: string;
        canCopyId: boolean;
    };
    metadata: {
        occurredAt: string;
        user: { fullName: string; initials: string } | null;
        action: string;
        operationKey: string;
        module: string;
        accessMethod?: string;
        sourceIp?: string;
    };
    summary: {
        totalFields: number;
        changedFields: number;
        unchangedFields: number;
        hasDiff: boolean;
        summaryKey: string;
    };
    table: {
        mode: HistoryTableMode;
        config: TableConfig;
        rows: HistoryDialogChangeRowVM[];
    };
    ui: {
        loading: boolean;
        empty: boolean;
        parseError: boolean;
        showDiffTable: boolean;
    };
}
