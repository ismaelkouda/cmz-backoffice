import { Conformity } from '@presentation/pages/processing/domain/enums/tasks/tasks-actions-conformity.enum';

export interface TasksActionsUpdateDto {
    uniqId: string;
    reportUniqId: string;
    date: Date | null;
    type: string;
    operator: string;
    description: string;
    shouldNotifyUser: boolean;
    isConform: Conformity | null;
}
