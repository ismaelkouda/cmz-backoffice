import { Conformity } from '@pages/processing/domain/enums/tasks/tasks-actions-conformity.enum';

export interface TasksActionsCreateContract {
    reportUniqId?: string;
    date?: Date | null;
    type?: string;
    operator?: string;
    description?: string;
    shouldNotifyUser?: boolean;
    shouldDisplayInNewspaper?: boolean;
    isConform?: Conformity | null;
}
