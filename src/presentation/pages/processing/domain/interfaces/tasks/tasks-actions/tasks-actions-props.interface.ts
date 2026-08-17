import { Conformity } from '@presentation/pages/processing/domain/enums/tasks/tasks-actions-conformity.enum';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';

export interface TasksActionsProps {
    uniqId: string;
    date: Date;
    type: string;
    code: string;
    operators: TelecomOperator[];
    description: string;
    shouldNotifyUser: boolean;
    autoChecked: boolean;
    isConform: Conformity;
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
}
