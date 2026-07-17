import { Conformity } from '@pages/processing/domain/enums/tasks/tasks-actions-conformity.enum';

export interface TasksActionsUpdateValidateContract {
    uniqId: string;
    reportUniqId: string;
    date: Date;
    type: string;
    operator: string;
    description: string;
    shouldNotifyUser: boolean;
    isConform: Conformity;
}
