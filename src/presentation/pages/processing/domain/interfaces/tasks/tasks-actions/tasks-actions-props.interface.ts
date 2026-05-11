import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';

export interface TasksActionsProps {
    uniqId: string;
    date: Date;
    type: string;
    code: string;
    operators: TelecomOperator[];
    description: string;
    shouldNotifyUser: boolean;
    isConform: boolean;
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
}
