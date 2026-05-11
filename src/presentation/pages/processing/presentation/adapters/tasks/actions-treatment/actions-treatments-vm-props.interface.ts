import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';

export interface TasksActionsVmProps {
    uniqId: string;
    type: string;
    code: string;
    operators: TelecomOperator[];
    shouldNotifyUser: boolean;
    isConform: boolean;
    date: string;
    description: string;
    notifyUser: boolean;
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
    actionsRef: string;

    tooltipButtonDelete: string;
    tooltipButtonEdit: string;
    disableButtonDelete: boolean;
    disableButtonEdit: boolean;
}
