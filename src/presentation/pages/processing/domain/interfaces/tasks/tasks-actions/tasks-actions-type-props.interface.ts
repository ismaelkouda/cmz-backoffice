import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';

export interface TasksActionsTypeProps {
    label: string;
    value: string;
    operators: TelecomOperator[];
}
