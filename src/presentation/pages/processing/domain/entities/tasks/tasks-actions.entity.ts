import { formatDateSafe } from '@shared/domain/functions/format-date';

import { TasksActionsProps } from '../../interfaces/tasks/tasks-actions/tasks-actions-props.interface';

export type TasksActionsType =
    | 'ANALYSIS'
    | 'TREATMENT'
    | 'VERIFICATION'
    | 'CORRECTION'
    | 'VALIDATION'
    | 'OTHER';

export class TasksActionsEntity implements TasksActionsProps {
    constructor(private readonly props: TasksActionsProps) {}

    get actionsRef(): string {
        return this.props.type;
    }

    get uniqId(): string {
        return this.props.uniqId;
    }

    get date(): Date {
        return this.props.date;
    }

    get formatDate(): string {
        return formatDateSafe(this.props.date);
    }

    get type(): string {
        return this.props.type;
    }

    get description(): string {
        return this.props.description;
    }

    get shouldNotifyUser(): boolean {
        return this.props.shouldNotifyUser;
    }

    get createdBy(): string {
        return this.props.createdBy;
    }

    get updatedBy(): string {
        return this.props.updatedBy;
    }

    get createdAt(): string {
        return this.props.createdAt;
    }

    get updatedAt(): string {
        return this.props.updatedAt;
    }

    public with(props: TasksActionsProps): TasksActionsEntity {
        if (this.uniqId === props.uniqId) {
            return this;
        }
        return new TasksActionsEntity(props);
    }
}
