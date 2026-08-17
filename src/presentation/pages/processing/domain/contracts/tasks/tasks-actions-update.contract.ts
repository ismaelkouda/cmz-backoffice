import { Conformity } from '@pages/processing/domain/enums/tasks/tasks-actions-conformity.enum';

export interface TasksActionsUpdateContract {
    uniqId?: string;
    reportUniqId?: string;
    date?: Date | null;
    type?: string;
    operator?: string;
    description?: string;
    shouldNotifyUser?: boolean;
    isConform?: Conformity | null;
}
