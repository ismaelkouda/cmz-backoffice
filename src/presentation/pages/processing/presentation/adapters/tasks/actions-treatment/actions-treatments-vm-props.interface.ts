import {
    Conformity,
    ConformityStyle,
} from '@presentation/pages/processing/domain/enums/tasks/tasks-actions-conformity.enum';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';

export interface TasksActionsVmProps {
    uniqId: string;
    type: string;
    code: string;
    operators: TelecomOperator[];
    shouldNotifyUser: boolean;
    isConform: Conformity;
    conformLabel: string;
    conformStyle: ConformityStyle;
    date: string;
    description: string;
    notifyUser: boolean;
    autoChecked: boolean;
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
