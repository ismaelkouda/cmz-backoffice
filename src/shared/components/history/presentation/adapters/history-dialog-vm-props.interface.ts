import { HistoryChangeType } from '../../domain/enums/history-change-type.enum';

export interface HistoryDialogChangeRowVM {
    fieldKey: string;
    fieldLabel: string;
    beforeDisplay: string;
    afterDisplay: string;
    changeLabelKey: string;
    changeStyle: 'success' | 'warning' | 'danger' | 'secondary';
    changed: boolean;
    changeType: HistoryChangeType;
    highlight: boolean;
}
