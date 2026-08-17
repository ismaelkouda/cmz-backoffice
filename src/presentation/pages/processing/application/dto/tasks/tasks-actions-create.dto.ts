import { Conformity } from '@presentation/pages/processing/domain/enums/tasks/tasks-actions-conformity.enum';

export interface TasksActionsCreateDto {
    reportUniqId: string;
    date: Date | null;
    type: string;
    operator: string;
    description: string;
    shouldNotifyUser: boolean;
    isConform: Conformity | null;
}
