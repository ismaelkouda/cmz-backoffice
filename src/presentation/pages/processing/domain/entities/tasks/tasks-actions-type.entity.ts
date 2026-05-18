import { TasksActionsTypeProps } from '@presentation/pages/processing/domain/interfaces/tasks/tasks-actions/tasks-actions-type-props.interface';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';

export class TasksActionsTypeEntity implements TasksActionsTypeProps {
    constructor(private readonly props: TasksActionsTypeProps) {}

    get label(): string {
        return this.props.label;
    }

    get value(): string {
        return this.props.value;
    }

    get operators(): TelecomOperator[] {
        return this.props.operators;
    }

    public with(props: TasksActionsTypeProps): TasksActionsTypeEntity {
        if (
            this.value === this.props.value &&
            this.label === props.label &&
            this.operators.length === props.operators.length
        ) {
            return this;
        }
        return new TasksActionsTypeEntity(props);
    }
}
