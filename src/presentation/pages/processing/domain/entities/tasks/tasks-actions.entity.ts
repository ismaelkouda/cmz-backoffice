export type TasksActionsType =
    | 'ANALYSIS'
    | 'TREATMENT'
    | 'VERIFICATION'
    | 'CORRECTION'
    | 'VALIDATION'
    | 'OTHER';

export interface TasksActionsProps {
    uniqId: string;
    date: Date;
    type: string;
    description: string;
    shouldNotifyUser: boolean;
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
}
export class TasksActionsEntity implements TasksActionsProps {
    constructor(private readonly props: TasksActionsProps) {}

    get uniqId(): string {
        return this.props.uniqId;
    }

    get date(): Date {
        return this.props.date;
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
