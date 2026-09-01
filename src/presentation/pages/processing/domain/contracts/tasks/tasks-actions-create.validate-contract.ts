import { Conformity } from '@pages/processing/domain/enums/tasks/tasks-actions-conformity.enum';

export interface TasksActionsCreateValidateContract {
    reportUniqId: string;
    date: Date;
    type: string;
    operator: string;
    description: string;
    shouldNotifyUser: boolean;
    shouldDisplayInNewspaper: boolean;
    isConform: Conformity | null;
}
